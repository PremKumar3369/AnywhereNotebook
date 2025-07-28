require("dotenv").config(); // MUST be the first line
const express = require("express");
const connectToMongo = require("./database");
const cors = require("cors");

const app = express();

// ✅ Allow only these origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://anywhere-notebook.vercel.app",
  "https://anywhere-notebook-git-main-premkumars-projects-da6e80b2.vercel.app"
];

(async () => {
  await connectToMongo();

  // ✅ CORS middleware: only allow from known origins
  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true, // if you're using cookies or auth headers
    })
  );

  // ✅ Middleware
  app.use(express.json());

  // ✅ Routes
  app.use("/api/auth", require("./routes/auth"));
  app.use("/api/notes", require("./routes/notes"));
  app.use("/api/notes", require("./routes/ask")); // NOTE: This overlaps the same path

  // ✅ Test route
  app.get("/", (req, res) => {
    res.send("Hello from AnywhereNotebook Backend 🚀");
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
})();
