function initTheme() {
  const root = document.documentElement;
  const toggleSlot = document.getElementById("theme-toggle-slot");

  // Create the button inside the slot
  const toggleBtn = document.createElement("button");
  toggleBtn.id = "theme-toggle";
  toggleBtn.setAttribute("aria-pressed", "false");
  toggleSlot.appendChild(toggleBtn);

  // Helper: apply theme
  function applyTheme(theme) {
    root.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      console.warn("Could not save theme:", e);
    }

    if (theme === "light") {
      toggleBtn.textContent = "DARK 🌙";
      toggleBtn.setAttribute("aria-pressed", "false");
    } else {
      toggleBtn.textContent = "LIGHT 🌞";
      toggleBtn.setAttribute("aria-pressed", "true");
    }
  }

  // Load saved theme or system preference
  let savedTheme;
  try {
    savedTheme = localStorage.getItem("theme");
  } catch (e) {
    savedTheme = null;
  }

  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }

  // Toggle on click
  toggleBtn.addEventListener("click", () => {
    const newTheme = root.dataset.theme === "light" ? "dark" : "light";
    applyTheme(newTheme);
  });
}

// Run on page load
document.addEventListener("DOMContentLoaded", initTheme);
