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
const planetDetailsEl = document.getElementById("planet-details");

// Inline SVG icons: they use currentColor, so they follow the theme
const cardIcons = {
    temperature: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M14 14.8V4.5a2.5 2.5 0 0 0-5 0v10.3a4.5 4.5 0 1 0 5 0z"/><path d="M19.5 4.5a1.8 1.8 0 1 1-3.6 0 1.8 1.8 0 0 1 3.6 0z" stroke-width="1.6"/></svg>',
    moons: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    diameter: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9.5"/></svg>',
    distance: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/></svg>'
};

// Put a card in the planet details section (replace the old one if present)
function mountPlanetCard(card) {
    const existingCard = planetDetailsEl.querySelector("#planet-card");
    if (existingCard) {
        existingCard.replaceWith(card);
    } else {
        planetDetailsEl.appendChild(card);
    }
}

function renderPlanetCard(planet) {
    const card = document.createElement("article");
    card.id = "planet-card";
    card.className = "planet-card";
    card.setAttribute("aria-labelledby", "planet-card-name");

    // Static structure only. Data is inserted with textContent below.
        card.innerHTML = `
        <figure class="planet-card__figure">
            <img class="planet-card__image" data-img width="116" height="116">
        </figure>
        <div class="planet-card__title">
            <h3 id="planet-card-name" data-field="name"></h3>
            <p class="planet-card__type" data-field="type"></p>
        </div>
        <p class="planet-card__description" data-field="description"></p>
        <dl class="planet-card__stats">
            <div><dt>Gravity</dt><dd data-field="gravity"></dd></div>
            <div><dt>Mass</dt><dd data-field="mass"></dd></div>
            <div><dt>Period</dt><dd data-field="period"></dd></div>
        </dl>
        <ul class="planet-card__facts">
            <li>${cardIcons.temperature}<span class="visually-hidden">Temperature in kelvin: </span><span data-field="temperature"></span></li>
            <li>${cardIcons.moons}<span class="visually-hidden">Moons: </span><span data-field="moons"></span></li>
            <li>${cardIcons.diameter}<span class="visually-hidden">Diameter in kilometres: </span><span data-field="diameter"></span></li>
            <li>${cardIcons.distance}<span class="visually-hidden">Distance from the Sun in million kilometres: </span><span data-field="distanceFromSun"></span></li> 
        </ul>
    `; 

    card.querySelectorAll("[data-field]").forEach((el) => {
        el.textContent = planet[el.dataset.field];
    });

    const cardImage = card.querySelector("[data-img]");
    cardImage.src = planet.image;
    cardImage.alt = planet.name;

    mountPlanetCard(card);
}

// Show Earth by default once the data arrives
document.addEventListener("planets:loaded", () => {
    const earth = findPlanetByName("Earth");
    if (earth) renderPlanetCard(earth);
});

/* ===== [feature/facts-table] ===== */
const factsContainer = document.getElementById("facts-table-container");

// Table groups, in display order. "type" values come from the API.
const factsGroups = [
    { label: "Terrestrial Planets", type: "Terrestrial" },
    {
        parent: "Jovian Planets",
        subgroups: [
            { label: "Gas Giants", type: "Gas Giant" },
            { label: "Ice Giants", type: "Ice Giant" }
        ]
    },
    { label: "Dwarf Planets", type: "Dwarf Planet" }
];

function makeFactsCell(tag, text, attrs = {}) {
    const cell = document.createElement(tag);
    cell.textContent = text;
    Object.entries(attrs).forEach(([name, value]) => cell.setAttribute(name, value));
    return cell;
}

function renderFactsTable(planetList) {
    const table = document.createElement("table");
    table.className = "facts-table";

    const caption = document.createElement("caption");
    caption.textContent = "Data about the planets of our solar system (Planetary facts taken from NASA)";
    table.appendChild(caption);

    // Header
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    const groupHead = makeFactsCell("th", "", { scope: "col", colspan: "2" });
    groupHead.innerHTML = '<span class="visually-hidden">Planet group</span>';
    headRow.appendChild(groupHead);
    headRow.appendChild(makeFactsCell("th", "Name", { scope: "col" }));
    const massHead = makeFactsCell("th", "", { scope: "col" });
    massHead.innerHTML = "Mass (10<sup>24</sup>kg)";
    headRow.appendChild(massHead);
    headRow.appendChild(makeFactsCell("th", "Diameter (km)", { scope: "col" }));
    thead.appendChild(headRow);
    table.appendChild(thead);

    // Body: rows are built from the data, not hard-coded
    const tbody = document.createElement("tbody");

    function addPlanetRows(list, leadingCells) {
        list.forEach((planet, index) => {
            const row = document.createElement("tr");
            if (index === 0) leadingCells.forEach((cell) => row.appendChild(cell));
            row.appendChild(makeFactsCell("th", planet.name, { scope: "row" }));
            row.appendChild(makeFactsCell("td", String(planet.mass)));
            row.appendChild(makeFactsCell("td", planet.diameter.toLocaleString("en-US")));
            tbody.appendChild(row);
        });
    }

    factsGroups.forEach((group) => {
        if (group.subgroups) {
            const subgroupLists = group.subgroups.map((sub) => ({
                sub,
                list: planetList.filter((planet) => planet.type === sub.type)
            })).filter((entry) => entry.list.length > 0);

            const total = subgroupLists.reduce((sum, entry) => sum + entry.list.length, 0);
            if (total === 0) return;

            subgroupLists.forEach((entry, subIndex) => {
                const leading = [];
                if (subIndex === 0) {
                    leading.push(makeFactsCell("th", group.parent, { scope: "rowgroup", rowspan: String(total) }));
                }
                leading.push(makeFactsCell("th", entry.sub.label, { scope: "rowgroup", rowspan: String(entry.list.length) }));
                addPlanetRows(entry.list, leading);
            });
        } else {
            const list = planetList.filter((planet) => planet.type === group.type);
            if (list.length === 0) return;
            const leading = [makeFactsCell("th", group.label, { scope: "rowgroup", colspan: "2", rowspan: String(list.length) })];
            addPlanetRows(list, leading);
        }
    });

    table.appendChild(tbody);
    factsContainer.replaceChildren(table);
}

document.addEventListener("planets:loaded", (e) => renderFactsTable(e.detail));


/* ===== [feature/theme-toggle] ===== */


/* ===== [feature/search-logic] ===== */
