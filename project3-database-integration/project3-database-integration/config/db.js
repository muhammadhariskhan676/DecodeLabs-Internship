// config/db.js
// This file is in charge of ONE thing - connecting to MongoDB.
// Keeping it separate from server.js keeps things clean.

const mongoose = require("mongoose");

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    // if the DB doesn't connect, there's no point running the server
    process.exit(1);
  }
}

module.exports = connectDB;
