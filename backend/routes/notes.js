const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

// Route 1: Get all notes for the logged-in user
router.get("/fetchAllNotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Route 2: Add a new note - POST /api/notes/addNote
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
      res.json(savedNote);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server Error" });
    }
  }
);

// Route 3: Update an existing note - PUT /api/notes/updateNote/:id
router.put("/updateNote/:id", fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;

  try {
    // Create newNote object with updated fields
    const newNote = {};
    if (title) newNote.title = title;
    if (description) newNote.description = description;
    if (tag) newNote.tag = tag;

    // Find note by ID
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Note Not Found" });
    }

    // Ensure the user owns the note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    // Update note
    note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
    res.json({ note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Route 4: Delete an existing note - DELETE /api/notes/deleteNote/:id
router.delete("/deleteNote/:id", fetchUser, async (req, res) => {
  try {
    // Find note by ID
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Note Not Found" });
    }

    // Check if the note belongs to the logged-in user
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    // Delete the note
    await Notes.findByIdAndDelete(req.params.id);
    res.json({ success: "Successfully deleted the note", note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
