// Simple in-memory "database" for interns.
// In a real project this would be replaced by MongoDB / MySQL / PostgreSQL.
// For Project 4 we only need to prove that the frontend and backend
// can talk to each other, so an in-memory array is enough.

let interns = [
  {
    id: 1,
    name: "Aditi Sharma",
    role: "Frontend Intern",
    email: "aditi.sharma@decodelabs.com",
    department: "Web Development",
    status: "Active"
  },
  {
    id: 2,
    name: "Rohan Verma",
    role: "Backend Intern",
    email: "rohan.verma@decodelabs.com",
    department: "Web Development",
    status: "Active"
  },
  {
    id: 3,
    name: "Sneha Patil",
    role: "Full Stack Intern",
    email: "sneha.patil@decodelabs.com",
    department: "Web Development",
    status: "Active"
  },
  {
    id: 4,
    name: "Karan Mehta",
    role: "QA Intern",
    email: "karan.mehta@decodelabs.com",
    department: "Quality Assurance",
    status: "On Leave"
  },
  {
    id: 5,
    name: "Priya Iyer",
    role: "UI/UX Intern",
    email: "priya.iyer@decodelabs.com",
    department: "Design",
    status: "Active"
  }
];

let nextId = interns.length + 1;

module.exports = {
  getAll: () => interns,

  getById: (id) => interns.find((intern) => intern.id === id),

  create: (internData) => {
    const newIntern = {
      id: nextId++,
      name: internData.name,
      role: internData.role,
      email: internData.email,
      department: internData.department,
      status: internData.status || "Active"
    };
    interns.push(newIntern);
    return newIntern;
  },

  update: (id, updates) => {
    const intern = interns.find((i) => i.id === id);
    if (!intern) return null;
    Object.assign(intern, updates);
    return intern;
  },

  remove: (id) => {
    const index = interns.findIndex((i) => i.id === id);
    if (index === -1) return false;
    interns.splice(index, 1);
    return true;
  }
};
