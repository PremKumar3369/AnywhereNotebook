    const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const supabase = require("../AI/supabaseClient");
const { pipeline } = require("@xenova/transformers");

// Lazy load the transformer
let embedderPromise = null;
async function getEmbedder() {
  if (!embedderPromise) {
    embedderPromise = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return await embedderPromise;
}

// POST /api/notes/ask
router.post("/ask", fetchUser, async (req, res) => {
  const { question } = req.body;
  // console.log('🔍 Question:', question);
  // console.log('👤 req.user:', req.user);
  if (!question || question.trim() === "") {
    return res.status(400).json({ error: "Question is required" });
  }

  try {
    const embedder = await getEmbedder();
    const result = await embedder([question], { pooling: 'mean', normalize: true });
    const vector = Array.from(result[0].data);

    // Search Supabase for most similar notes
    const { data, error } = await supabase.rpc("match_notes", {
      query_embedding: vector,
      match_count: 5,
      user_id: req.user.id,
    });
    //  console.log('📦 Vector search results:', data);

    if (error) {
      console.error("Supabase match_notes error:", error);
      return res.status(500).json({ error: "Vector search failed" });
    }

    res.json({ results: data });
  } catch (err) {
    console.error("Ask route error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
