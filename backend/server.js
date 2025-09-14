const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mysql = require("mysql2");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "store_rating_db",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL database");
});

// Make db available to routes
app.locals.db = db;

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/stores", require("./routes/stores"));
app.use("/api/ratings", require("./routes/ratings"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔗 Auth endpoints:     http://localhost:${PORT}/api/auth/...`);
  console.log(`🔗 User endpoints:     http://localhost:${PORT}/api/users/...`);
  console.log(`🔗 Store endpoints:    http://localhost:${PORT}/api/stores/...`);
  console.log(`🔗 Rating endpoints:   http://localhost:${PORT}/api/ratings/...`);
});
