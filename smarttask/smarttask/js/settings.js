/**
 * settings.js
 * Logic specific to the Settings page:
 *  - profile form validation (email format)
 *  - password form validation (length, number requirement, match check)
 *  - toast feedback on save / update / toggle change
 *  - "Change Photo" button placeholder feedback
 *
 * Shared chrome (sidebar, dropdowns, dark mode) is handled in app.js
 */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initProfileForm();
    initPasswordForm();
    initNotificationToggles();
    initChangePhotoButton();
  });

  /* ----------------------------------------------------------------
     Profile form: validates email format before "saving"
  ---------------------------------------------------------------- */
  function initProfileForm() {
    const form = document.getElementById("profileForm");
    if (!form) return;

    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("emailError");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const isEmailValid = emailPattern.test(emailInput.value.trim());
      toggleFieldError(emailInput, emailError, !isEmailValid);

      if (!isEmailValid) {
        emailInput.focus();
        return;
      }

      if (window.SmartTask && window.SmartTask.showToast) {
        window.SmartTask.showToast("Profile updated successfully");
      }
    });

    // Clear the error as soon as the user starts fixing the email
    emailInput.addEventListener("input", function () {
      if (emailPattern.test(emailInput.value.trim())) {
        toggleFieldError(emailInput, emailError, false);
      }
    });
  }

  /* ----------------------------------------------------------------
     Password form: checks length/number rule and that the two new
     password fields match before allowing "submission"
  ---------------------------------------------------------------- */
  function initPasswordForm() {
    const form = document.getElementById("passwordForm");
    if (!form) return;

    const newPasswordInput = document.getElementById("newPassword");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const newPasswordError = document.getElementById("newPasswordError");
    const confirmPasswordError = document.getElementById("confirmPasswordError");

    // A new password needs at least 8 characters and one digit
    const passwordPattern = /^(?=.*\d).{8,}$/;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const isPasswordValid = passwordPattern.test(newPasswordInput.value);
      const doPasswordsMatch =
        newPasswordInput.value === confirmPasswordInput.value && confirmPasswordInput.value !== "";

      toggleFieldError(newPasswordInput, newPasswordError, !isPasswordValid);
      toggleFieldError(confirmPasswordInput, confirmPasswordError, isPasswordValid && !doPasswordsMatch);

      if (!isPasswordValid) {
        newPasswordInput.focus();
        return;
      }
      if (!doPasswordsMatch) {
        confirmPasswordInput.focus();
        return;
      }

      form.reset();
      if (window.SmartTask && window.SmartTask.showToast) {
        window.SmartTask.showToast("Password updated successfully");
      }
    });

    newPasswordInput.addEventListener("input", function () {
      if (passwordPattern.test(newPasswordInput.value)) {
        toggleFieldError(newPasswordInput, newPasswordError, false);
      }
    });

    confirmPasswordInput.addEventListener("input", function () {
      if (confirmPasswordInput.value === newPasswordInput.value && confirmPasswordInput.value !== "") {
        toggleFieldError(confirmPasswordInput, confirmPasswordError, false);
      }
    });
  }

  function toggleFieldError(inputEl, errorEl, showError) {
    inputEl.classList.toggle("is-invalid", showError);
    if (errorEl) errorEl.classList.toggle("is-visible", showError);
  }

  /* ----------------------------------------------------------------
     Notification toggles: just confirms the change with a toast,
     since there is no backend to persist the preference to.
  ---------------------------------------------------------------- */
  function initNotificationToggles() {
    const toggles = document.querySelectorAll(".toggle-switch input[type='checkbox']");

    toggles.forEach(function (toggle) {
      toggle.addEventListener("change", function () {
        const label = toggle.closest(".toggle-row").querySelector(".toggle-row__label").textContent;
        const state = toggle.checked ? "enabled" : "disabled";
        if (window.SmartTask && window.SmartTask.showToast) {
          window.SmartTask.showToast(label + " " + state);
        }
      });
    });
  }

  /* ----------------------------------------------------------------
     Change photo placeholder
  ---------------------------------------------------------------- */
  function initChangePhotoButton() {
    const btn = document.getElementById("changePhotoBtn");
    if (!btn) return;

    btn.addEventListener("click", function () {
      if (window.SmartTask && window.SmartTask.showToast) {
        window.SmartTask.showToast("Photo upload dialog would open here");
      }
    });
  }
})();
