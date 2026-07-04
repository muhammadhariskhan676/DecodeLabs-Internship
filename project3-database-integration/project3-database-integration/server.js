// server.js
// Run with: node server.js
// Make sure you've set MONGO_URI in your .env file first!

require("dotenv").config();
const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/tasks");

const app = express();
const PORT = process.env.PORT || 5000;

// connect to MongoDB before anything else
connectDB();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is up and running",
  });
});

app.use("/api/tasks", taskRoutes);

// 404 handler - runs when no route matched
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// generic error handler (catches anything unexpected)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
