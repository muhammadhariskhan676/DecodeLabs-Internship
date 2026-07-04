// routes/tasks.js
// This file just connects URLs + HTTP methods to the controller functions.
// Keeping routes separate from logic makes the project easier to read.

const express = require("express");
const router = express.Router();

const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

router.get("/", getAllTasks); // GET    /api/tasks
router.get("/:id", getTaskById); // GET    /api/tasks/:id
router.post("/", createTask); // POST   /api/tasks
router.put("/:id", updateTask); // PUT    /api/tasks/:id
router.delete("/:id", deleteTask); // DELETE /api/tasks/:id

module.exports = router;
