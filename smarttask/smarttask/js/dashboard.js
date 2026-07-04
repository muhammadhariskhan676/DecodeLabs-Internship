/**
 * dashboard.js
 * Logic specific to the Dashboard page only:
 *  - marking recent tasks complete/incomplete from the checkbox
 *  - "New Task" button feedback (no backend yet, so just confirms the action)
 *
 * Shared chrome (sidebar, dropdowns, dark mode) is handled in app.js
 */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initTaskCheckboxes();
    initNewTaskButton();
  });

  function initTaskCheckboxes() {
    const checkboxes = document.querySelectorAll(".task-row__checkbox");

    checkboxes.forEach(function (checkbox) {
      checkbox.addEventListener("change", function () {
        const row = checkbox.closest(".task-row");
        if (!row) return;

        row.classList.toggle("is-complete", checkbox.checked);

        const badge = row.querySelector(".badge");
        if (checkbox.checked && badge) {
          // Remember the original priority badge so we can restore it
          // if the user unchecks the task again.
          if (!badge.dataset.originalClass) {
            badge.dataset.originalClass = badge.className;
            badge.dataset.originalText = badge.textContent.trim();
          }
          badge.className = "badge badge--done";
          badge.innerHTML = '<span class="badge-dot"></span>Done';
        } else if (!checkbox.checked && badge && badge.dataset.originalClass) {
          badge.className = badge.dataset.originalClass;
          badge.innerHTML = '<span class="badge-dot"></span>' + badge.dataset.originalText;
        }
      });
    });
  }

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
