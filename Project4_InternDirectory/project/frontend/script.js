// script.js
// Project 4 - Frontend & Backend Integration
// This file is the "Frontend (Sensory Interface)" from the training slides.
// It uses fetch() with async/await to talk to the Express backend,
// and updates the DOM safely using textContent (avoids XSS).

const API_BASE_URL = "http://localhost:5000/api";

// ---------- Element references ----------
const internGrid = document.getElementById("internGrid");
const loadingState = document.getElementById("loadingState");
const errorState = document.getElementById("errorState");
const errorText = document.getElementById("errorText");
const emptyState = document.getElementById("emptyState");
const retryBtn = document.getElementById("retryBtn");
const refreshBtn = document.getElementById("refreshBtn");

const internForm = document.getElementById("internForm");
const submitBtn = document.getElementById("submitBtn");
const formMessage = document.getElementById("formMessage");

const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");

// ---------- Helper: show only one state box at a time ----------
function setViewState(state) {
  loadingState.classList.add("hidden");
  errorState.classList.add("hidden");
  emptyState.classList.add("hidden");
  internGrid.innerHTML = "";

  if (state === "loading") loadingState.classList.remove("hidden");
  if (state === "error") errorState.classList.remove("hidden");
  if (state === "empty") emptyState.classList.remove("hidden");
}

// ---------- Check backend health on page load ----------
async function checkServerStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);

    if (!response.ok) {
      throw new Error("Server responded with an error");
    }

    statusDot.classList.add("online");
    statusDot.classList.remove("offline");
    statusText.textContent = "Server connected";
  } catch (error) {
    statusDot.classList.add("offline");
    statusDot.classList.remove("online");
    statusText.textContent = "Server offline";
  }
}

// ---------- Fetch all interns from the backend ----------
async function loadInterns() {
  setViewState("loading");

  try {
    const response = await fetch(`${API_BASE_URL}/interns`);

    // Always check response.ok before trusting the payload.
    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const result = await response.json();
    renderInterns(result.data);
  } catch (error) {
    console.error("Failed to load interns:", error);
    errorText.textContent =
      "Could not load interns. Make sure the backend server is running on port 5000.";
    setViewState("error");
  }
}

// ---------- Render intern cards safely into the DOM ----------
function renderInterns(interns) {
  internGrid.innerHTML = "";

  if (!interns || interns.length === 0) {
    setViewState("empty");
    return;
  }

  loadingState.classList.add("hidden");
  errorState.classList.add("hidden");
  emptyState.classList.add("hidden");

  interns.forEach((intern) => {
    const card = buildInternCard(intern);
    internGrid.appendChild(card);
  });
}

function buildInternCard(intern) {
  const card = document.createElement("div");
  card.className = "intern-card";

  const name = document.createElement("h3");
  // textContent is used instead of innerHTML to prevent
  // Cross-Site Scripting (XSS) if the data ever contains HTML/script tags.
  name.textContent = intern.name;

  const role = document.createElement("p");
  role.className = "role";
  role.textContent = intern.role;

  const emailRow = document.createElement("div");
  emailRow.className = "meta-row";
  emailRow.appendChild(makeMailIcon());
  const emailText = document.createElement("span");
  emailText.textContent = intern.email;
  emailRow.appendChild(emailText);

  const deptRow = document.createElement("div");
  deptRow.className = "meta-row";
  deptRow.appendChild(makeDeptIcon());
  const deptText = document.createElement("span");
  deptText.textContent = intern.department;
  deptRow.appendChild(deptText);

  const badge = document.createElement("span");
  const isActive = intern.status === "Active";
  badge.className = `badge ${isActive ? "active" : "leave"}`;
  badge.textContent = intern.status;

  const actions = document.createElement("div");
  actions.className = "card-actions";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "icon-btn";
  deleteBtn.title = "Remove intern";
  deleteBtn.appendChild(makeTrashIcon());
  deleteBtn.addEventListener("click", () => deleteIntern(intern.id));

  actions.appendChild(deleteBtn);

  card.appendChild(name);
  card.appendChild(role);
  card.appendChild(emailRow);
  card.appendChild(deptRow);
  card.appendChild(badge);
  card.appendChild(actions);

  return card;
}

// ---------- Small inline SVG icon builders (no emoji, no external icon library) ----------
function makeMailIcon() {
  return svgFromMarkup(
    '<path d="M3 5h18v14H3z" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M3 6l9 7 9-7" stroke="currentColor" stroke-width="1.5" fill="none"/>'
  );
}

function makeDeptIcon() {
  return svgFromMarkup(
    '<rect x="3" y="7" width="18" height="13" rx="1.5" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="1.5" fill="none"/>'
  );
}

function makeTrashIcon() {
  return svgFromMarkup(
    '<path d="M4 7h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M9 7V4h6v3" stroke="currentColor" stroke-width="1.5"/><path d="M6 7l1 13h10l1-13" stroke="currentColor" stroke-width="1.5" fill="none"/>'
  );
}

function svgFromMarkup(innerMarkup) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.innerHTML = innerMarkup;
  return svg;
}

// ---------- Create a new intern (POST request) ----------
async function createIntern(formData) {
  submitBtn.disabled = true;
  formMessage.textContent = "";
  formMessage.className = "form-message";

  try {
    const response = await fetch(`${API_BASE_URL}/interns`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (!response.ok) {
      // The backend sends a message field describing what went wrong.
      throw new Error(result.message || "Failed to add intern.");
    }

    formMessage.textContent = "Intern added successfully.";
    formMessage.classList.add("success");
    internForm.reset();
    loadInterns();
  } catch (error) {
    console.error("Failed to create intern:", error);
    formMessage.textContent = error.message || "Something went wrong. Please try again.";
    formMessage.classList.add("error");
  } finally {
    submitBtn.disabled = false;
  }
}

// ---------- Delete an intern (DELETE request) ----------
async function deleteIntern(id) {
  const confirmed = window.confirm("Remove this intern from the directory?");
  if (!confirmed) return;

  try {
    const response = await fetch(`${API_BASE_URL}/interns/${id}`, {
      method: "DELETE"
    });

    // DELETE returns 204 No Content on success - there is no JSON body to parse.
    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    loadInterns();
  } catch (error) {
    console.error("Failed to delete intern:", error);
    alert("Could not remove this intern. Please try again.");
  }
}

// ---------- Form submit handler ----------
internForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = {
    name: document.getElementById("name").value.trim(),
    role: document.getElementById("role").value.trim(),
    email: document.getElementById("email").value.trim(),
    department: document.getElementById("department").value.trim()
  };

  createIntern(formData);
});

// ---------- Button handlers ----------
retryBtn.addEventListener("click", loadInterns);
refreshBtn.addEventListener("click", loadInterns);

// ---------- Initial load ----------
checkServerStatus();
loadInterns();
