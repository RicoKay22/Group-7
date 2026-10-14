# Planet | Solar System Facts

**Group 7 capstone project, TSAcademy Hajime cohort**

🔗 **Live site:** https://group-7-kappa.vercel.app
📦 **Repository:** https://github.com/RicoKay22/Group-7

---

## About the project

Planet is a responsive web app that lets you search the planets of our solar system and compare their key facts. It fetches planet data from a public API and shows, for each planet: name, image, type, distance from the Sun, mass, diameter, orbital period, temperature, gravity, number of moons and a short description.

The app was recreated from a Figma mockup (design by Amaka N) and supports **light and dark mode** (with a toggle), plus desktop, tablet and mobile layouts. It is built with plain **HTML, CSS and JavaScript**, with no frameworks.

**Features**
- Planet card (Earth by default) with all 11 data fields
- Search by planet name: not case-sensitive, partial names allowed ("ear" finds Earth), with a "No results" state
- "Planetary Facts at a Glance" table, grouped as Terrestrial, Jovian (Gas Giants and Ice Giants) and Dwarf Planets
- Light/dark theme toggle that remembers your choice and falls back to your system preference
- Responsive layout (tablet at 768px, mobile at 480px) with the special mobile card layout from the design
- Semantic HTML, keyboard-friendly controls, visible focus states, skip link and screen-reader labels

---

## Group members

| Member | GitHub |
| --- | --- |
| Olayinka Olumide (Group lead) | [RicoKay22](https://github.com/RicoKay22) |
| Temitope Precious | [Dewale-web](https://github.com/Dewale-web) |
| Omijori Muiz | [MuizAyo6](https://github.com/MuizAyo6) |
| Matthew Botti | [mattsax-coder](https://github.com/mattsax-coder) |
| Adediwura Favour | [Favour-AFTAA](https://github.com/Favour-AFTAA) |
| Ako Esther | [Esther772](https://github.com/Esther772)  |
| Ijezie Emmanuel | [ijezie17](https://github.com/ijezie17) |
| Sanni Azeezat | [azeezatsanni19-eng](https://github.com/azeezatsanni19-eng) |
| Adegbulugbe Ayomikun | [Big-kalag](https://github.com/Big-kalag) |
| Akinbinu Toluwalope | [ToluKresha](https://github.com/ToluKresha) |
| Olatunde Ibrahim | [Akinade-01](https://github.com/Akinade-01) |
| Helen Ali Damisa | [Haz-Hub2026](https://github.com/Haz-Hub2026) |


> Design: [Amaka N](https://amakandukwu.com)

---

## Components and who built them

Everything lives in three files. `script.js` and `main.css` are split into marked blocks (`[feature/...]`), one per feature branch, so each person worked in their own block.

| Component / function | Where | What it does | Built by |
| --- | --- | --- | --- |
| Base layout (`index.html`, base styles, CSS variables) | all files | Page structure, light/dark colour tokens, shared styles | **Olayinka Olumide** (group lead) |
| `fetchPlanets()`, `loadPlanets()`, `findPlanetByName()`, status helpers | `[feature/api-fetch]` | Fetches the API, handles loading/error states, broadcasts the `planets:loaded` event | **Olayinka Olumide** (group lead) |
| `renderPlanetCard(planet)` | `[feature/planet-card]` | Builds the planet card: image, type, description, stats box and icon rows | **Temitope Precious** and **Helen Ali** |
| `renderFactsTable(planets)` | `[feature/facts-table]` | Builds the grouped comparison table from the data | **Omijori Muiz** and **Olatunde Ibrahim** |
| Header, logo and search form UI | `[feature/header-search]` | Logo, search bar, hover/focus/error states (markup and styling only) | **Matthew Botti** |
| `initTheme()` | `[feature/theme-toggle]` | Light/dark toggle, saved in `localStorage` | **Adediwura Favour** and **Ako Esther** |
| `searchPlanets(query)`, `renderNotFound(query)` | `[feature/search-logic]` | Search logic and the "No results found" card | **Ijezie Emmanuel** and **Sanni Azeezat ** |
| Footer | `[feature/footer]` | About text and credit links | **Adegbulugbe Ayomikun** |
| Responsive styles | `[feature/responsive]` | Tablet and mobile layouts | **Akinbinu Toluwalope** |
| README and QA | `README.md` | Documentation, cross-browser and Lighthouse testing | **Olayinka Olumide** (group lead) |
| Deployment | Hosting the live site | **Olayinka Olumide** (group lead) |

### How the pieces talk to each other

`loadPlanets()` fetches the data once, then broadcasts a `planets:loaded` event. The planet card and the facts table each listen for it and render themselves. Search reads from the shared `planets` array.

---

## Run the project locally

You need a modern browser and an internet connection (the planet data and images load from an online API).

1. **Clone the repository**
   ```bash
   git clone https://github.com/RicoKay22/Group-7.git
   cd Group-7
   code .
   ```
2. **Open the app**
   - Easiest: double-click `index.html`, or
   - Recommended: use the **Live Server** extension in VS Code (right-click `index.html` → *Open with Live Server*), or run a simple server:
     ```bash
     python3 -m http.server 8000
     ```
     then visit `http://localhost:8000`.
3. **Try it out:** search for `mars` or `ear`, switch light/dark with the toggle, and resize the window to see the tablet and mobile layouts.

**Project structure**
```
Group-7/
├── index.html
├── main.css
├── script.js
├── images/
│   ├── logo-black.svg   (used in light mode)
│   └── logo-white.svg   (used in dark mode)
└── README.md
```

**API:** `https://anurella.github.io/json/planet.json`

---

## Team workflow

One task = one branch = one pull request. Nobody merges their own PR: the assigned reviewer approves and merges into `main`. Commit prefixes used: `feat:`, `fix:`, `docs:`.
