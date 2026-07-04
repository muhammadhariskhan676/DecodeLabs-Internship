/**
 * tasks.js
 * Logic specific to the Tasks page:
 *  - status filter pills (All / To Do / In Progress / In Review / Done)
 *  - live search by task title
 *  - opening the task details modal with the clicked task's data
 *  - checkbox complete/incomplete toggling (same pattern as dashboard.js)
 *
 * Data is read directly from the DOM (data-* attributes on .task-row),
 * there's no separate JSON data file since this is a static front-end demo.
 */

(function () {
  "use strict";

  let activeFilter = "all";
  let searchTerm = "";

  document.addEventListener("DOMContentLoaded", function () {
    initFilterPills();
    initSearch();
    initTaskCheckboxes();
    initTaskModal();
    initNewTaskButton();
  });

  /* ----------------------------------------------------------------
     Status filter pills
  ---------------------------------------------------------------- */
  function initFilterPills() {
    const pills = document.querySelectorAll(".filter-pill");

    pills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        pills.forEach(function (p) {
          p.classList.remove("is-active");
          p.setAttribute("aria-selected", "false");
        });
        pill.classList.add("is-active");
        pill.setAttribute("aria-selected", "true");

        activeFilter = pill.getAttribute("data-filter");
        applyFilters();
      });
    });
  }

  /* ----------------------------------------------------------------
     Live search by task title
  ---------------------------------------------------------------- */
  function initSearch() {
    const searchInput = document.getElementById("taskSearch");
    if (!searchInput) return;

    searchInput.addEventListener("input", function () {
      searchTerm = searchInput.value.trim().toLowerCase();
      applyFilters();
    });
  }

  /* ----------------------------------------------------------------
     Combines the active status filter with the search term and
     shows/hides rows accordingly. Also updates the result counter
     and the empty state message.
  ---------------------------------------------------------------- */
  function applyFilters() {
    const rows = document.querySelectorAll(".task-row");
    let visibleCount = 0;

    rows.forEach(function (row) {
      const matchesStatus = activeFilter === "all" || row.getAttribute("data-status") === activeFilter;
      const matchesSearch = searchTerm === "" || row.getAttribute("data-title").indexOf(searchTerm) !== -1;
      const isVisible = matchesStatus && matchesSearch;

      row.classList.toggle("hidden", !isVisible);
      if (isVisible) visibleCount++;
    });

    const resultCount = document.getElementById("taskResultCount");
    if (resultCount) {
      resultCount.textContent = visibleCount + (visibleCount === 1 ? " task" : " tasks");
    }

    const emptyState = document.getElementById("emptyState");
    if (emptyState) {
      emptyState.classList.toggle("hidden", visibleCount !== 0);
    }
  }

  /* ----------------------------------------------------------------
     Checkbox complete/incomplete toggle (mirrors dashboard.js)
  ---------------------------------------------------------------- */
  function initTaskCheckboxes() {
    const checkboxes = document.querySelectorAll(".task-row__checkbox");

    checkboxes.forEach(function (checkbox) {
      checkbox.addEventListener("change", function (event) {
        // Prevent the click from also triggering the row's "open modal" handler
        event.stopPropagation();

        const row = checkbox.closest(".task-row");
        if (!row) return;
        row.classList.toggle("is-complete", checkbox.checked);
      });
    });
  }

  /* ----------------------------------------------------------------
     Task details modal
     Clicking a task row's main content area opens the modal and
     fills it in with that row's data attributes / visible content.
  ---------------------------------------------------------------- */
  function initTaskModal() {
    const overlay = document.getElementById("taskModalOverlay");
    const closeBtn = document.getElementById("modalCloseBtn");
    const closeBtnSecondary = document.getElementById("modalCloseBtnSecondary");
    const editBtn = document.getElementById("modalEditBtn");
    if (!overlay) return;

    document.querySelectorAll("[data-open-task]").forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        populateModal(trigger.closest(".task-row"));
        openModal();
      });
    });

    function openModal() {
      overlay.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      overlay.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    closeBtn.addEventListener("click", closeModal);
    closeBtnSecondary.addEventListener("click", closeModal);
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) closeModal();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeModal();
    });

    editBtn.addEventListener("click", function () {
      closeModal();
      if (window.SmartTask && window.SmartTask.showToast) {
        window.SmartTask.showToast("Edit form would open here");
      }
    });
  }

  function populateModal(row) {
    if (!row) return;

    const title = row.querySelector(".task-row__title").textContent.trim();
    const metaSpans = row.querySelectorAll(".task-row__meta span");
    const dueText = metaSpans[0] ? metaSpans[0].textContent.replace(/^[^A-Za-z]*/, "").trim() : "";
    const projectText = metaSpans[1] ? metaSpans[1].textContent.trim() : "";
    const statusBadge = row.querySelector(".task-row__side .badge:nth-of-type(1)");
    const priorityBadge = row.querySelector(".task-row__side .badge:nth-of-type(2)");
    const avatar = row.querySelector(".task-row__side img");

    document.getElementById("modalTaskTitle").textContent = title;
    document.getElementById("modalTaskDue").textContent = dueText || "Not set";
    document.getElementById("modalTaskProject").textContent = projectText || "Unassigned";

    if (avatar) {
      document.getElementById("modalTaskAvatar").src = avatar.src;
      document.getElementById("modalTaskAssignee").textContent = avatar.alt;
    }

    const modalStatus = document.getElementById("modalTaskStatus");
    if (statusBadge) {
      modalStatus.className = statusBadge.className;
      modalStatus.textContent = statusBadge.textContent.trim();
    }

    const modalPriority = document.getElementById("modalTaskPriority");
    if (priorityBadge) {
      modalPriority.className = priorityBadge.className;
      modalPriority.innerHTML = priorityBadge.innerHTML;
    }

    // A short, plausible description placeholder relevant to the task title.
    // In a real product this would come from the backend rather than being
    // generated client-side, but for a static demo this keeps the modal useful.
    document.getElementById("modalTaskDescription").textContent =
      "Full task details, comments and file attachments for \"" + title + "\" would load here from the project's task record.";
  }

  /* ----------------------------------------------------------------
     New Task button feedback
  ---------------------------------------------------------------- */
  function initNewTaskButton() {
    const newTaskBtn = document.getElementById("newTaskBtn");
    if (!newTaskBtn) return;

    newTaskBtn.addEventListener("click", function () {
      if (window.SmartTask && window.SmartTask.showToast) {
        window.SmartTask.showToast("Task creation form would open here");
      }
    });
  }
})();
