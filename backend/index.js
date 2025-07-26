require('dotenv').config(); // this line MUST be the first line
const express = require("express");
const connectToMongo = require("./database");


var cors = require("cors");

const app = express();

(async () => {
  await connectToMongo();
  // to enable CORS
app.use(cors({
  origin: ["https://anywhere-notebook.vercel.app"],
  credentials: true,
}));

  // Middleware
  app.use(express.json());

  // Available Routes
  app.use("/api/auth", require("./routes/auth"));
  app.use("/api/notes", require("./routes/notes"));
  app.use("/api/notes", require("./routes/ask"));

  // Root route (optional)
  app.get("/", (req, res) => {
    res.send("hello");
  });

  // Start the server
  const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});

})();
