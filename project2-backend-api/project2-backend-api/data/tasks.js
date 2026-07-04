// data/tasks.js
// This is just a temporary "database" using a normal JS array.
// Since this project is only about backend API logic (not databases yet),
// we are storing everything in memory. This means data will reset
// every time the server restarts. That's okay for now.

let tasks = [
  {
    id: 1,
    title: "Learn Express.js basics",
    completed: false,
  },
  {
    id: 2,
    title: "Build first API endpoint",
    completed: true,
  },
];

// keeps track of the next id to give a new task
let nextId = 3;

module.exports = {
  tasks,
  getNextId: () => nextId++,
};
