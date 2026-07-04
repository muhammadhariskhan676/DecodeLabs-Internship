// server.js
// Entry point of the backend API.
// Run this file with: node server.js

const express = require("express");
const path = require("path");
const taskRoutes = require("./routes/tasks");

const app = express();
const PORT = process.env.PORT || 5000;

// middleware to let express understand JSON sent in request body
app.use(express.json());

// serve the simple test page (public/index.html) so we can test the API
// from the browser without needing Postman
app.use(express.static(path.join(__dirname, "public")));

// a simple health check route, useful to confirm the server is alive
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is up and running",
  });
});

// all task related routes start with /api/tasks
app.use("/api/tasks", taskRoutes);

// 404 handler - runs if no route above matched the request
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// basic error handler - catches anything that throws inside a route
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
