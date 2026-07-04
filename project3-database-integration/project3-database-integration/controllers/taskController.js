// controllers/taskController.js
// Same idea as Project 2, but now every function actually talks to
// MongoDB through the Task model instead of a plain JS array.
// Mongoose automatically uses parameterized queries under the hood,
// so we are protected from basic SQL/NoSQL injection style attacks
// as long as we don't manually build queries from raw strings.

const Task = require("../models/Task");

// CREATE -> POST /api/tasks
async function createTask(req, res) {
  try {
    const { title, description, priority } = req.body;

    // we still do our own basic check before even hitting the schema,
    // just to send back a clean error message early
    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const task = await Task.create({ title, description, priority });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    handleError(res, error);
  }
}

// READ ALL -> GET /api/tasks
async function getAllTasks(req, res) {
  try {
    // optional ?completed=true / ?completed=false filter
    const filter = {};
    if (req.query.completed === "true") filter.completed = true;
    if (req.query.completed === "false") filter.completed = false;

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    handleError(res, error);
  }
}

// READ ONE -> GET /api/tasks/:id
async function getTaskById(req, res) {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    handleError(res, error);
  }
}

// UPDATE -> PUT /api/tasks/:id
async function updateTask(req, res) {
  try {
    const { title, description, completed, priority } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, completed, priority },
      {
        new: true, // return the updated document, not the old one
        runValidators: true, // re-run schema validation on update too
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    handleError(res, error);
  }
}

// DELETE -> DELETE /api/tasks/:id
async function deleteTask(req, res) {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    handleError(res, error);
  }
}

// small helper so I'm not repeating the same try/catch error logic
// in every single function above
function handleError(res, error) {
  console.error(error.message);

  // mongoose validation error (e.g. title too short, bad priority value)
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: messages.join(", "),
    });
  }

  // invalid mongodb ObjectId format (e.g. someone passed "abc123" as id)
  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid task id format",
    });
  }

  res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
  });
}

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
