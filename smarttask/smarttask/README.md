# SmartTask - Task Management Dashboard

A responsive front-end dashboard for managing tasks, tracking project progress, and coordinating with a team. Built as a university front-end engineering project to practice semantic HTML, CSS Grid/Flexbox layout, and vanilla JavaScript DOM manipulation without relying on any framework.

## Live Pages

- `index.html` — Dashboard (stats, recent tasks, activity timeline, project progress)
- `pages/tasks.html` — Tasks (filterable list, search, task details modal)
- `pages/team.html` — Team (member directory with contact actions)
- `pages/settings.html` — Settings (profile, password, notification preferences)

## Tech Stack

- HTML5
- CSS3 (Flexbox + CSS Grid, mobile-first responsive design)
- Vanilla JavaScript (no frameworks, no build step)
- Font: Inter (Google Fonts)
- Icons: hand-written inline SVGs in the Lucide style (no icon font, no external icon request needed)
- Avatars: Unsplash portrait photography

## Folder Structure

```
project/
│
├── index.html
├── pages/
│   ├── tasks.html
│   ├── team.html
│   └── settings.html
│
├── css/
│   ├── style.css         → design tokens, resets, layout shell, typography
│   ├── components.css    → sidebar, topbar, cards, badges, modal, forms
│   └── responsive.css    → mobile-first breakpoints (480 / 768 / 1024 / 1440)
│
├── js/
│   ├── app.js             → shared chrome: sidebar drawer, dropdowns, dark mode
│   ├── dashboard.js        → dashboard-only behavior (task checkboxes, new task button)
│   ├── tasks.js             → tasks page: filtering, search, modal
│   └── settings.js          → settings page: form validation, toggle feedback
│
├── assets/
│   ├── images/
│   └── icons/
│
└── README.md
```

## Features

**Navigation**
- Collapsible sidebar on desktop/laptop (state remembered via localStorage)
- Slide-in mobile navigation drawer below 1024px
- Active page highlighting in the sidebar

**Dashboard**
- Four key statistic cards with week-over-week trend indicators
- Recent tasks list with checkbox completion toggling
- Activity timeline showing recent team actions
- Per-project progress bars

**Tasks**
- Status filter pills (All / To Do / In Progress / In Review / Done)
- Live search by task title
- Priority badges (High / Medium / Low)
- Task details modal triggered by clicking a task row

**Team**
- Responsive member grid (1 → 2 → 3 → 4 columns by breakpoint)
- Online/away/offline status indicators
- Per-member task and project counts
- Email and message contact actions

**Settings**
- Profile form with email format validation
- Password form with length/number rule and confirm-password matching
- Notification preference toggles with instant feedback

**Other**
- Dark mode toggle, persisted across pages via localStorage
- Toast notifications for user feedback on actions without a backend
- Keyboard accessible: focus states, Escape closes modals/dropdowns, skip-to-content link

## Responsive Breakpoints

| Breakpoint | Width    | Behavior                                              |
|------------|----------|--------------------------------------------------------|
| Mobile     | 320px+   | Sidebar becomes an off-canvas drawer, single-column grids |
| Small      | 480px+   | Stat cards move to a 2-column grid                     |
| Tablet     | 768px+   | Search bar visible, team grid becomes 2 columns         |
| Laptop     | 1024px+  | Sidebar becomes a fixed column, full stat/team grids     |
| Desktop    | 1440px+  | Wider page padding, team grid expands to 4 columns       |

## Running Locally

No build tools or dependencies are required. Clone or download the project folder and open `index.html` directly in a browser, or serve it with any static server, for example:

```
npx serve .
```

or, with Python:

```
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Notes

This is a front-end-only project — there is no backend or database connected. Actions like creating a task, saving profile changes, or updating a password are simulated with toast confirmations so the interface feels complete during a demo or walkthrough. Connecting it to a real API (REST or otherwise) would be the natural next step.

## Author

Muhammad Haris Khan
BSE-F23-E11, Software Engineering
University of Mianwali
