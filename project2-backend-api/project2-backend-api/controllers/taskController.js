// controllers/taskController.js
// This file holds the "brain" of each route.
// The route file just decides WHICH function runs, this file decides
// WHAT actually happens.

const { tasks, getNextId } = require("../data/tasks");

// GET /api/tasks
// returns every task we currently have
function getAllTasks(req, res) {
  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
}

// GET /api/tasks/:id
// returns a single task by its id
function getTaskById(req, res) {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: `Task with id ${id} was not found`,
    });
  }

  res.status(200).json({
    success: true,
    data: task,
  });
}

// POST /api/tasks
// creates a new task
function createTask(req, res) {
  const { title, completed } = req.body;

  // basic validation - "never trust the client" :)
  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Title is required and must be a non-empty string",
    });
  }

  const newTask = {
    id: getNextId(),
    title: title.trim(),
    completed: completed === true ? true : false, // default to false if missing
  };

  tasks.push(newTask);

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: newTask,
  });
}

// PUT /api/tasks/:id
// updates an existing task (mark complete, change title, etc)
function updateTask(req, res) {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: `Task with id ${id} was not found`,
    });
  }

  const { title, completed } = req.body;

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Title must be a non-empty string",
      });
    }
    task.title = title.trim();
  }

  if (completed !== undefined) {
    if (typeof completed !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Completed must be true or false",
      });
    }
    task.completed = completed;
  }

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    data: task,
  });
}

// DELETE /api/tasks/:id
// removes a task from the list
function deleteTask(req, res) {
  const id = Number(req.params.id);
  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Task with id ${id} was not found`,
    });
  }

  tasks.splice(taskIndex, 1);

  res.status(200).json({
    success: true,
    message: `Task with id ${id} deleted successfully`,
  });
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
