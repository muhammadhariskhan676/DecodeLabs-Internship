/**
 * app.js
 * Shared logic that runs on every page of SmartTask:
 *  - sidebar collapse (desktop) / drawer (mobile)
 *  - profile + notification dropdown menus
 *  - dark mode toggle (persisted in localStorage)
 *  - highlights the current page in the sidebar nav
 *
 * Page-specific logic (dashboard widgets, task filtering, etc.) lives in
 * dashboard.js and tasks.js so this file stays focused and reusable.
 */

(function () {
  "use strict";

  const STORAGE_KEY_THEME = "smarttask_theme";
  const STORAGE_KEY_SIDEBAR = "smarttask_sidebar_collapsed";

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initSidebarCollapse();
    initMobileDrawer();
    initDropdowns();
    highlightActiveNavLink();
    initLogoutConfirm();
  });

  /* ----------------------------------------------------------------
     Dark mode
     We store the preference in localStorage so it persists across
     the dashboard, tasks, team and settings pages.
  ---------------------------------------------------------------- */
  function initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
    if (savedTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    }

    const toggleButtons = document.querySelectorAll("[data-theme-toggle]");
    toggleButtons.forEach(function (btn) {
      updateThemeIcon(btn);
      btn.addEventListener("click", function () {
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        if (isDark) {
          document.documentElement.removeAttribute("data-theme");
          localStorage.setItem(STORAGE_KEY_THEME, "light");
        } else {
          document.documentElement.setAttribute("data-theme", "dark");
          localStorage.setItem(STORAGE_KEY_THEME, "dark");
        }
        document.querySelectorAll("[data-theme-toggle]").forEach(updateThemeIcon);
      });
    });
  }

  function updateThemeIcon(btn) {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const sunIcon = btn.querySelector(".icon-sun");
    const moonIcon = btn.querySelector(".icon-moon");
    if (!sunIcon || !moonIcon) return;
    sunIcon.style.display = isDark ? "block" : "none";
    moonIcon.style.display = isDark ? "none" : "block";
  }

  /* ----------------------------------------------------------------
     Sidebar collapse (desktop / laptop view, 1024px and up)
  ---------------------------------------------------------------- */
  function initSidebarCollapse() {
    const appShell = document.querySelector(".app-shell");
    const collapseBtn = document.querySelector("[data-sidebar-collapse]");
    if (!appShell || !collapseBtn) return;

    const isCollapsed = localStorage.getItem(STORAGE_KEY_SIDEBAR) === "true";
    if (isCollapsed) {
      appShell.classList.add("sidebar-collapsed");
    }

    collapseBtn.addEventListener("click", function () {
      appShell.classList.toggle("sidebar-collapsed");
      localStorage.setItem(
        STORAGE_KEY_SIDEBAR,
        appShell.classList.contains("sidebar-collapsed")
      );
    });
  }

  /* ----------------------------------------------------------------
     Mobile navigation drawer (below 1024px, sidebar slides in)
  ---------------------------------------------------------------- */
  function initMobileDrawer() {
    const sidebar = document.querySelector(".sidebar");
    const openBtn = document.querySelector("[data-drawer-open]");
    const closeBtn = document.querySelector("[data-drawer-close]");
    const overlay = document.querySelector("[data-drawer-overlay]");

    if (!sidebar || !openBtn || !overlay) return;

    function openDrawer() {
      sidebar.classList.add("is-open");
      overlay.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }

    function closeDrawer() {
      sidebar.classList.remove("is-open");
      overlay.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    openBtn.addEventListener("click", openDrawer);
    overlay.addEventListener("click", closeDrawer);
    if (closeBtn) closeBtn.addEventListener("click", closeDrawer);

    // Close the drawer automatically if the viewport grows past tablet size
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1024) {
        closeDrawer();
      }
    });
  }

  /* ----------------------------------------------------------------
     Generic dropdown handling (profile menu, notification bell)
     Any element with [data-dropdown-trigger] toggles the panel that
     matches its data-dropdown-target attribute.
  ---------------------------------------------------------------- */
  function initDropdowns() {
    const triggers = document.querySelectorAll("[data-dropdown-trigger]");

    triggers.forEach(function (trigger) {
      const targetId = trigger.getAttribute("data-dropdown-trigger");
      const panel = document.getElementById(targetId);
      if (!panel) return;

      trigger.addEventListener("click", function (event) {
        event.stopPropagation();
        const wasOpen = panel.classList.contains("is-open");
        closeAllDropdowns();
        if (!wasOpen) {
          panel.classList.add("is-open");
        }
      });
    });

    // Clicking anywhere outside closes all open dropdowns
    document.addEventListener("click", closeAllDropdowns);

    // Escape key closes dropdowns too
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeAllDropdowns();
    });
  }

  function closeAllDropdowns() {
    document.querySelectorAll(".dropdown-panel.is-open").forEach(function (panel) {
      panel.classList.remove("is-open");
    });
  }

  /* ----------------------------------------------------------------
     Marks the current page link in the sidebar as active based on
     the page's <body data-page="..."> attribute.
  ---------------------------------------------------------------- */
  function highlightActiveNavLink() {
    const currentPage = document.body.getAttribute("data-page");
    if (!currentPage) return;

    document.querySelectorAll(".nav-link").forEach(function (link) {
      if (link.getAttribute("data-page-link") === currentPage) {
        link.classList.add("is-active");
      } else {
        link.classList.remove("is-active");
      }
    });
  }

  /* ----------------------------------------------------------------
     Simple confirm before logging out, just so the button does
     something meaningful instead of a dead link.
  ---------------------------------------------------------------- */
  function initLogoutConfirm() {
    const logoutLink = document.querySelector("[data-logout]");
    if (!logoutLink) return;

    logoutLink.addEventListener("click", function (event) {
      event.preventDefault();
      const confirmed = window.confirm("Are you sure you want to sign out?");
      if (confirmed) {
        showToast("Signed out successfully");
      }
    });
  }

  /* ----------------------------------------------------------------
     Toast helper - reused by tasks.js and settings page inline script
     Exposed on window so other scripts can call SmartTask.showToast()
  ---------------------------------------------------------------- */
  function showToast(message) {
    let toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      toast.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg><span class="toast__text"></span>';
      document.body.appendChild(toast);
    }
    toast.querySelector(".toast__text").textContent = message;
    toast.classList.add("is-visible");

    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 3000);
  }

  // Expose a small shared namespace for the other page scripts
  window.SmartTask = window.SmartTask || {};
  window.SmartTask.showToast = showToast;
})();
