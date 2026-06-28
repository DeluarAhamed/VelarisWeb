# Velaris Web — UI Kit · Web Console

A high-fidelity, interactive recreation of the **Velaris Web** product — the
platform's web console for deploying and monitoring sites. Built on the Ant
Design component grammar, rebranded with Velaris teal, Cabinet Grotesk (UI) and
Zodiak (display).

> This is a **design recreation**, not production code. Components are simple,
> mostly-cosmetic versions meant for fast, pixel-accurate mockups. There was no
> existing Velaris product codebase to copy from, so the screens, data and flows
> here are an original-but-on-brand interpretation of a deploy/analytics console.

## Run it
Open `index.html`. It loads React + Babel and the kit files in order. Icons are
inlined from `../../assets/icons` (set via `window.ICON_BASE`).

## Interactive flow
- **Login** → OAuth buttons, email/password with show/hide, "Sign in" enters the app.
- **Dashboard** → stat cards, recent-projects table, activity feed. Click a row to open a project.
- **Projects** → grid of sites with status; "New project" opens a modal (pick framework, create → deploy toast). Top-bar search filters.
- **Project detail** → header with domain, stat row, deployments table. "Projects" breadcrumb returns.
- **Analytics** → KPIs, 7-day traffic chart (brand-gradient bar), top pages, country breakdown.
- **Team** → member table, "Invite member" modal.
- **Settings** → profile + workspace forms with a toggle.
- View state (auth + active nav) persists in `localStorage` so reloads keep your place.

## Files
| File | Role |
|---|---|
| `index.html` | Entry — script load order + mount point. |
| `kit.css` | All component + layout styles (builds on `../../colors_and_type.css`). |
| `primitives.jsx` | `Icon`, `Button`, `Tag`, `Avatar`, `Field`, `Input`, `Logo`, `VelarisMark`. |
| `chrome.jsx` | `Sidebar`, `TopBar`. |
| `data.js` | Mock data (user, projects, activity, team, status map). |
| `screens.jsx` | `Dashboard`, `Projects`, `Analytics`, `Team`, `Settings` + `StatCard`, `StatusTag`, `Toggle`. |
| `extras.jsx` | `Login`, `ProjectDetail`, `Modal`, `NewProjectModal`, `InviteModal`. |
| `app.jsx` | Root — routing, modals, toast, persistence. |

## Conventions
- All components expose themselves on `window` (Babel scripts don't share scope).
- Sentence case, "you", no emoji. Teal = brand/primary; blue reserved for info.
- Icons via `<Icon name="…" size={n} />` (inlines the Ant SVG, recolors with `currentColor`).
- Animations are transform-only entrances — content is never hidden behind an
  animation (so it stays visible even when the iframe backgrounds animations).
