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
/* ==========================================================
   GROUP 7 CAPSTONE: script.js
   How the pieces talk to each other (like a radio station):
   api-fetch "broadcasts" a "planets:loaded" event once the data
   arrives. Each feature "tunes in" with its own listener.

   RULES
   1. Write your code ONLY inside your own marked block.
   2. Register listeners at the top level (not inside another function):
        document.addEventListener("planets:loaded", (e) => renderFactsTable(e.detail));
   3. Keep blank lines between blocks so Git can merge them cleanly.

   FUNCTION NAMES (agreed contract)
   fetchPlanets(), loadPlanets()   -> feature/api-fetch
   renderPlanetCard(planet)        -> feature/planet-card
   renderFactsTable(planets)       -> feature/facts-table
   initTheme()                     -> feature/theme-toggle
   searchPlanets(query)            -> feature/search-logic
   ========================================================== */


/* ===== [feature/api-fetch] ===== */
// Owner: Olayinka Olumide (Group lead). fetchPlanets(), loadPlanets(), status helpers, "planets:loaded" event
const API_URL = "https://anurella.github.io/json/planet.json";

// Shared data: every feature reads planets from here after "planets:loaded"
let planets = [];

const statusEl = document.getElementById("planet-status");

function showStatus(message, isError = false) {
    statusEl.textContent = message;
    statusEl.hidden = false;
    statusEl.classList.toggle("status--error", isError);
}

function clearStatus() {
    statusEl.textContent = "";
    statusEl.hidden = true;
}

async function fetchPlanets() {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error(`Could not load planets (HTTP ${response.status})`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
        throw new Error("Unexpected API response: expected a list of planets");
    }
    return data;
}

async function loadPlanets() {
    showStatus("Loading planets…");
    try {
        planets = await fetchPlanets();
        clearStatus();
        document.dispatchEvent(new CustomEvent("planets:loaded", { detail: planets }));
    } catch (error) {
        console.error(error);
        showStatus("We couldn't load the planets. Check your connection and refresh the page.", true);
    }
}

function findPlanetByName(name) {
    return planets.find((planet) => planet.name.toLowerCase() === name.toLowerCase());
}

loadPlanets();


/* ===== [feature/header-search] ===== */


/* ===== [feature/planet-card] ===== */


/* ===== [feature/facts-table] ===== */


/* ===== [feature/theme-toggle] ===== */


/* ===== [feature/search-logic] ===== */
