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

const earth ={
    name: "Earth",
    type: "Terrestrial",
    distanceFromSun: 149.6,
    image: "https://via.placeholder.com/150",
    mass: 0.00315,
    diameter: 12742,
    period: 365,
    temperature: 288,
    gravity: 9.8,
    moons: 1,
    description: "The only known planet to support life, with liquid water on it's surface."
};

function renderPlanetCard(planet) {
    const cardContainer = document.getElementById("planet-card");

    cardContainer.innerHTML = `
        <figure>
            <img src="${planet.image}" alt="${planet.name}">
        </figure>
        <div class="card-top">
            <div class="card-info">
                <h3>${planet.name}</h3>
                <p class="type">${planet.type}</p>
            </div>

            <p>${planet.description}</p>

            <div class="stat-section">
                <dl>
                    <dt>Gravity</dt>
                    <dd>${planet.gravity}</dd>
                </dl>

                <dl>
                    <dt>Mass</dt>
                    <dd>${planet.mass}</dd>
                </dl>

                <dl>
                    <dt>Period</dt>
                    <dd>${planet.period}</dd>
                </dl>
            </div>

            <div class="icon-grid">
                <div class="icon-row">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.48276 4.5C2.48276 2.01562 4.7069 0 7.44828 0C10.1897 0 12.4138 2.01562 12.4138 4.5V12.2203C13.9397
                        13.4578 14.8966 15.2531 14.8966 17.25C14.8966 20.9766 11.5603 24 7.44828 24C3.33621 24 0 20.9766 0 17.25C0 15.2531 0.956897 13.4531 2.48276 12.2203V4.5ZM7.44828 20.25C9.27414 20.25 10.7586 18.9047 10.7586 17.25C10.7586 15.9891 9.90517 14.9109 8.68966 14.4703V4.5C8.68966 3.87656 8.13621 3.375 7.44828 3.375C6.76034 3.375 6.2069 3.87656 6.2069 4.5V14.4703C4.99138 14.9156 4.13793 15.9937 4.13793 17.25C4.13793 18.9047 5.62241 20.25 7.44828 20.25ZM21.5172 3.75C21.5172 2.92031 20.7776 2.25 19.8621 2.25C18.9466 2.25 18.2069 2.92031 18.2069 3.75C18.2069 4.57969 18.9466 5.25 19.8621 5.25C20.7776 5.25 21.5172 4.57969 21.5172 3.75ZM15.7241 3.75C15.7241 1.67812 17.5759 0 19.8621 0C22.1483 0 24 1.67812 24 3.75C24 5.82188 22.1483 7.5 19.8621 7.5C17.5759 7.5 15.7241 5.82188 15.7241 3.75Z" fill="currentColor"/>
                    </svg>
                    <span class="visually-hidden">Temperature:</span>
                    <span>${planet.temperature}</span>
                </div>

                <div class="icon-row">
                    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.5133 11.3967C19.3087 11.3453 19.1041 11.3966 18.9251 11.5251C18.2602 12.0901 17.4929 12.5523 16.649 12.8605C15.8562 13.1687 14.9866 13.3228 14.066 13.3228C11.9944 13.3228 10.1019 12.4753 8.74647 11.1142C7.39102 9.75303 6.54707 7.85258 6.54707 5.77237C6.54707 4.89919 6.70051 4.0517 6.95626 3.28125C7.23758 2.45944 7.64677 1.71467 8.18383 1.07263C8.414 0.790132 8.36285 0.379226 8.08153 0.148091C7.90251 0.0196826 7.69792 -0.0316807 7.49332 0.0196826C5.31949 0.61036 3.42698 1.92012 2.07153 3.66648C0.767234 5.38715 0 7.51872 0 9.83007C0 12.6294 1.12528 15.1719 2.96664 17.0209C4.808 18.87 7.3143 20 10.1275 20C12.4803 20 14.6542 19.1782 16.3932 17.8171C18.1579 16.4303 19.4366 14.4528 19.9737 12.1928C20.076 11.8332 19.8714 11.4737 19.5133 11.3967Z" fill="currentColor"/>
                    </svg>
                    <span class="visually-hidden">Moons:</span>
                    <span>${planet.moons}</span>
                </div>

                <div class="icon-row">
                    <svg  viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.0068 0C18.6271 0.000228354 24.0127 5.38322 24.0127 12C24.0128 18.6164 18.6271 23.9998 12.0068 24C12.0057 24 12.0041 23.999 12.0029 23.999L12 24C5.38333 24 2.25982e-07 18.6168 0 12C0 5.38323 5.38328 0 12 0H12.0068Z" fill="currentColor"/>
                    </svg>
                    <span class="visually-hidden">Diameter:</span>
                    <span>${planet.diameter}</span>
                </div> 
                
                <div class="icon-row">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 0C12.3333 0 12.6417 0.166667 12.8292 0.441667L15.2792 4.08333L19.5875 3.24167C19.9125 3.17917 20.25 3.27917 20.4875 3.51667C20.725 3.75417 20.825 4.09167 20.7625
                        4.41667L19.9167 8.72083L23.5583 11.1708C23.8333 11.3542 24 11.6667 24 12C24 12.3333 23.8333 12.6417 23.5583 12.8292L19.9167 15.2792L20.7583 19.5833C20.8208 19.9083 20.7208 20.2458 20.4833 20.4833C20.2458 20.7208 19.9083 20.8208 19.5833 20.7583L15.2792 19.9167L12.8292 23.5583C12.6417 23.8333 12.3333 24 12 24C11.6667 24 11.3583 23.8333 11.1708 23.5583L8.72083 19.9167L4.4125 20.7583C4.0875 20.8208 3.75 20.7208 3.5125 20.4833C3.275 20.2458 3.175 19.9083 3.2375 19.5833L4.08333 15.2792L0.441667 12.8292C0.166667 12.6417 0 12.3333 0 12C0 11.6667 0.166667 11.3583 0.441667 11.1708L4.08333 8.72083L3.24167 4.4125C3.17917 4.0875 3.27917 3.75 3.51667 3.5125C3.75417 3.275 4.09167 3.175 4.41667 3.2375L8.72083 4.07917L11.1708 0.4375L11.2458 0.341667C11.4333 0.125 11.7083 0 12 0ZM10.0083 5.75C9.78333 6.08333 9.38333 6.25 8.9875 6.175L5.4875 5.49167L6.17083 8.99167C6.24583 9.3875 6.07917 9.7875 5.74583 10.0125L2.79167 12L5.75 13.9917C6.08333 14.2167 6.25 14.6167 6.175 15.0125L5.49167 18.5125L8.99167 17.8292L9.1375 17.8125C9.48333 17.7958 9.81667 17.9625 10.0125 18.2542L12.0042 21.2125L13.9958 18.2542L14.0875 18.1375C14.3208 17.8833 14.6708 17.7625 15.0167 17.8333L18.5167 18.5167L17.8333 15.0167C17.7583 14.6208 17.925 14.2208 18.2583 13.9958L21.2167 12.0042L18.2583 10.0125C17.925 9.7875 17.7583 9.3875 17.8333 8.99167L18.5167 5.49167L15.0167 6.175C14.6208 6.25 14.2208 6.08333 13.9958 5.75L12.0042 2.79167L10.0125 5.75H10.0083ZM12 17C9.2375 17 7 14.7625 7 12C7 9.2375 9.2375 7 12 7C14.7625 7 17 9.2375 17 12C17 14.7625 14.7625 17 12 17ZM12 9C10.3417 9 9 10.3417 9 12C9 13.6583 10.3417 15 12 15C13.6583 15 15 13.6583 15 12C15 10.3417 13.6583 9 12 9Z" fill="currentColor"/>
                    </svg>
                    <span class="visually-hidden">Distance from Sun:</span>
                    <span>${planet.distanceFromSun}</span>
                </div>
            </div>
        </div>
    </article>
    
    `;
}

document.addEventListener("planets:loaded", () => {
    const earthData = findPlanetByName("Earth");
    renderPlanetCard(earthData);
});

/* ===== [feature/facts-table] ===== */


/* ===== [feature/theme-toggle] ===== */


/* ===== [feature/search-logic] ===== */
