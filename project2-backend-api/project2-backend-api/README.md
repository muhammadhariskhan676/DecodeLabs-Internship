# Project 2 - Backend API Development (Task Manager API)

DecodeLabs Industrial Training Kit - Full Stack Development
Submitted by: Muhammad Haris Khan

## What this project does

A simple REST API built with **Node.js + Express** that manages a list of
tasks (like a mini to-do list backend). It covers the core requirements
of Project 2:

- API endpoints using GET / POST (also added PUT and DELETE for completeness)
- Handling user input from request body and URL params
- Basic data validation
- Proper HTTP status codes (200, 201, 400, 404, 500)
- A small HTML test client (with icons) so the API can be tested directly
  in the browser without Postman

Data is stored in memory (a plain JS array), since this project is about
API logic, not databases yet.

## Folder structure

```
project2-backend-api/
├── server.js                 # entry point, starts the express app
├── routes/
│   └── tasks.js               # maps URLs to controller functions
├── controllers/
│   └── taskController.js      # actual logic for each route
├── data/
│   └── tasks.js                # in-memory "database"
├── public/
│   └── index.html              # simple test UI with icons
└── package.json
```

## How to run it

```bash
npm install
npm start
```

Then open your browser at:

```
http://localhost:5000
```

This loads the test UI. The API itself lives under `/api/tasks`.

## API Endpoints

| Method | Endpoint          | Description              |
|--------|-------------------|---------------------------|
| GET    | /api/tasks        | Get all tasks             |
| GET    | /api/tasks/:id    | Get one task by id        |
| POST   | /api/tasks        | Create a new task         |
| PUT    | /api/tasks/:id    | Update an existing task   |
| DELETE | /api/tasks/:id    | Delete a task             |
| GET    | /api/health       | Check if server is alive  |

### Example - Create a task (POST /api/tasks)

Request body:
```json
{
  "title": "Finish DecodeLabs Project 2"
}
```

Success response (201 Created):
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": 3,
    "title": "Finish DecodeLabs Project 2",
    "completed": false
  }
}
```

Validation error response (400 Bad Request) - if title is missing:
```json
{
  "success": false,
  "message": "Title is required and must be a non-empty string"
}
```

## Notes / things I learned doing this project

- "Never trust the client" - always validate incoming data on the server,
  even if the frontend already validates it.
- Status codes actually mean something: 200 for normal success, 201 when
  something new is created, 400 when the client sent bad data, 404 when
  the resource doesn't exist, 500 for unexpected server errors.
- Keeping routes and controllers in separate files makes the project much
  easier to read once it grows past 2-3 endpoints.
