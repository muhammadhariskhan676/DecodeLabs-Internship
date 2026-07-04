// server.js
// Project 4 - Frontend & Backend Integration
// This is the "Backend (Cognitive Vault)" from the training slides.
// It exposes a small REST API that the frontend talks to using fetch().

const express = require("express");
const cors = require("cors");
const interns = require("./data");

const app = express();
const PORT = 5000;

// Allow the frontend (served from a different origin/port) to call this API.
// Without this, the browser's CORS policy would block the requests.
app.use(cors());

// Parse incoming JSON request bodies (needed for POST / PUT / PATCH).
app.use(express.json());

// Simple request logger - helps while debugging, just like in real projects.
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// ---------- ROUTES ----------

// Health check route - useful to confirm the server is alive.
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// GET /api/interns -> Retrieve all interns
app.get("/api/interns", (req, res) => {
  const allInterns = interns.getAll();
  res.status(200).json({
    success: true,
    count: allInterns.length,
    data: allInterns
  });
});

// GET /api/interns/:id -> Retrieve a single intern
app.get("/api/interns/:id", (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid intern id. It must be a number."
    });
  }

  const intern = interns.getById(id);

  if (!intern) {
    return res.status(404).json({
      success: false,
      message: `No intern found with id ${id}`
    });
  }

  res.status(200).json({ success: true, data: intern });
});

// POST /api/interns -> Create a new intern
app.post("/api/interns", (req, res) => {
  const { name, role, email, department } = req.body;

  // Basic validation - always validate input on the backend,
  // never trust data coming from the frontend.
  if (!name || !role || !email || !department) {
    return res.status(400).json({
      success: false,
      message: "name, role, email and department are all required fields."
    });
  }

  const newIntern = interns.create(req.body);
  res.status(201).json({
    success: true,
    message: "Intern created successfully",
    data: newIntern
  });
});

// PUT /api/interns/:id -> Replace / update an intern completely
app.put("/api/interns/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name, role, email, department, status } = req.body;

  if (!name || !role || !email || !department) {
    return res.status(400).json({
      success: false,
      message: "name, role, email and department are all required fields."
    });
  }

  const updated = interns.update(id, { name, role, email, department, status });

  if (!updated) {
    return res.status(404).json({
      success: false,
      message: `No intern found with id ${id}`
    });
  }

  res.status(200).json({
    success: true,
    message: "Intern updated successfully",
    data: updated
  });
});

// PATCH /api/interns/:id -> Partially update an intern (e.g. status only)
app.patch("/api/interns/:id", (req, res) => {
  const id = Number(req.params.id);
  const updated = interns.update(id, req.body);

  if (!updated) {
    return res.status(404).json({
      success: false,
      message: `No intern found with id ${id}`
    });
  }

  res.status(200).json({
    success: true,
    message: "Intern updated successfully",
    data: updated
  });
});

// DELETE /api/interns/:id -> Remove an intern
app.delete("/api/interns/:id", (req, res) => {
  const id = Number(req.params.id);
  const wasDeleted = interns.remove(id);

  if (!wasDeleted) {
    return res.status(404).json({
      success: false,
      message: `No intern found with id ${id}`
    });
  }

  // 204 No Content - action succeeded, nothing to return.
  res.status(204).send();
});

// Catch-all for any route that doesn't exist.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Generic error handler - catches anything unexpected.
app.use((err, req, res, next) => {
  console.error("Unexpected server error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
