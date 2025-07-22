require('dotenv').config(); // this line MUST be the first line
const express = require("express");
const connectToMongo = require("./database");


var cors = require("cors");

const app = express();

(async () => {
  await connectToMongo();
  // to enable CORS
  app.use(cors());
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
  app.listen(5000, () => {
    console.log("🚀 Server listening on http://localhost:5000");
  });
})();
