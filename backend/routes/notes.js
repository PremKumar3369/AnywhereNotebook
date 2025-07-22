const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");
const supabase = require("../AI/supabaseClient");
const { pipeline } = require('@xenova/transformers');

// 🧠 Lazy-initialized embedding pipeline
let embedderPromise = null;

async function getEmbedder() {
  if (!embedderPromise) {
    embedderPromise = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return await embedderPromise;
}

// ✅ Fetch all notes
router.get("/fetchAllNotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ Add a new note + store vector
router.post(
  "/addNote",
  fetchUser,
  [
    body("title", "Title must be at least 3 characters").isLength({ min: 3 }),
    body("description", "Description must be at least 5 characters").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, tag } = req.body;

      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });

      const savedNote = await note.save();

      // 🧠 Generate embedding
      const embedder = await getEmbedder();
      const inputText = `${title}\n\n${description}`;

      const result = await embedder([inputText], {
        pooling: 'mean',
        normalize: true,
      });

      const vector = Array.from(result[0].data);

      // 💾 Store embedding in Supabase
      const { error } = await supabase.from('note_embeddings').insert([{
  user_id: req.user.id,
  note_id: savedNote._id.toString(),
  content: inputText,
  embedding: vector,
}]);

if (error) {
  console.error("🔥 Supabase insert error:", error);
  return res.status(500).json({ error: "Vector storage failed" });
}


      res.json(savedNote);
    } catch (err) {
      console.error("AddNote error:", err);
      return res.status(500).json({ error: "Server Error" });
    }
  }
);

// ✅ Update an existing note
router.put("/updateNote/:id", fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;

  try {
    const newNote = {};
    if (title) newNote.title = title;
    if (description) newNote.description = description;
    if (tag) newNote.tag = tag;

    let note = await Notes.findById(req.params.id);
    if (!note) return res.status(404).json({ error: "Note Not Found" });

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
    res.json({ note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ Delete a note
router.delete("/deleteNote/:id", fetchUser, async (req, res) => {
  try {
    let note = await Notes.findById(req.params.id);
    if (!note) return res.status(404).json({ error: "Note Not Found" });

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    await Notes.findByIdAndDelete(req.params.id);
    res.json({ success: "Successfully deleted the note", note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
