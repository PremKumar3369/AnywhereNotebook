require("dotenv").config(); // MUST be the first line
const express = require("express");
const connectToMongo = require("./database");
const cors = require("cors");

const app = express();

// ✅ Allow only these origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://anywhere-notebook-git-main-premkumars-projects-da6e80b2.vercel.app",
  "https://anywhere-notebook.vercel.app",

  "https://anywhere-notebook-git-main-premkumars-projects-da6e80b2.vercel.app",
];

(async () => {
  await connectToMongo();

  // ✅ Fix: CORS with function to handle multiple origins
  app.use(
  cors({
    origin: function (origin, callback) {
  console.log("Incoming origin:", origin);
  callback(null, true); // temporarily allow all origins
}
    },
  
  )
);


  // ✅ Optional: Add CORS headers manually (not strictly required with cors(), but safe)
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });

  // Middleware
  app.use(express.json());

  // Routes
  app.use("/api/auth", require("./routes/auth"));
  app.use("/api/notes", require("./routes/notes"));
  app.use("/api/notes", require("./routes/ask"));

  // Test route
  app.get("/", (req, res) => {
    res.send("hello");
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
  });
})();
