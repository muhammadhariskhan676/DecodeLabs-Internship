// models/Task.js
// This is the SCHEMA - basically the blueprint for how a "task" is
// stored in the database. Mongoose uses this to validate data before
// it ever touches MongoDB, so the database is never trusted blindly
// with bad data (same idea as the "Gatekeeper Rule" from the slides).

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high"],
        message: "Priority must be either low, medium or high",
      },
      default: "medium",
    },
  },
  {
    // automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);
