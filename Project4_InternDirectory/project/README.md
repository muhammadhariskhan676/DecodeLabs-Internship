# DecodeLabs Intern Directory — Project 4

Frontend & Backend Integration project for the Full Stack Development
Industrial Training Kit (Batch 2026).

## What this project does

A small full stack web application where the frontend sends requests
to a backend REST API to view, add, and remove intern records.

- **Backend**: Node.js + Express REST API (in-memory data store)
- **Frontend**: Plain HTML, CSS and JavaScript using `fetch()` with
  `async/await`

## Folder structure

```
project/
├── backend/
│   ├── server.js       Express server and all API routes
│   ├── data.js         In-memory intern data and helper functions
│   └── package.json
└── frontend/
    ├── index.html       Page structure
    ├── style.css        Styling
    └── script.js        Fetch calls, DOM rendering, form handling
```

## How to run it

### 1. Start the backend

```
cd backend
npm install
npm start
```

The API will run at `http://localhost:5000`.

### 2. Start the frontend

Open a second terminal:

```
cd frontend
python3 -m http.server 8080
```

(Any static file server works. You can also just open `index.html`
directly in the browser, but running it through a local server avoids
some browser restrictions.)

Then open `http://localhost:8080` in your browser.

## API endpoints

| Method | Endpoint            | Description                     |
|--------|----------------------|----------------------------------|
| GET    | /api/health          | Check if the server is running  |
| GET    | /api/interns          | Get all interns                 |
| GET    | /api/interns/:id      | Get one intern by id             |
| POST   | /api/interns          | Add a new intern                |
| PUT    | /api/interns/:id      | Replace an intern's full details |
| PATCH  | /api/interns/:id      | Update part of an intern's data  |
| DELETE | /api/interns/:id      | Remove an intern                 |

## Features implemented

- Frontend sends requests to the backend using `fetch()`
- All backend calls use `async/await` (no callback nesting)
- Dynamic data is rendered on the page instead of hardcoded HTML
- Basic error handling: shows a message if the server is offline or
  returns an error status
- Loading state while waiting for the server response
- Empty state when there are no interns
- Add intern form with validation on both frontend and backend
- Delete intern with a confirmation prompt
- Uses `textContent` (not `innerHTML`) when inserting data into the
  page, to avoid XSS
- CORS enabled on the backend so the frontend (different port) can
  call it
- Correct HTTP status codes used throughout (200, 201, 204, 400, 404,
  500)

## Notes

Data is stored in memory on the backend (`data.js`), so it resets
every time the server restarts. This is intentional for this project
— the focus is on the frontend/backend communication, not on a
permanent database.
