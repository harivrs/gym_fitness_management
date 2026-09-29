# FitPulse | Gym & Fitness Club Membership System | Small progress is still progress💪🏼
> **Course:** Software Engineering (SWE) Course Assignment  
> **Project:** Centralized Gym & Fitness Club Membership Management System  
> **Tech Stack:** HTML5, CSS3 (Modern Glassmorphism & Athletic Dark Theme), JavaScript (ES6+), Chart.js, FontAwesome 6, LocalStorage DB.

---

## 📌 1. Project Overview & Problem Statement

The **Gym/Fitness Club Membership System (FitPulse)** is a responsive web application designed to simplify and automate the daily administrative and member-facing operations of a modern fitness center. 

In traditional fitness centers, records for members, subscriptions, trainers, classes, and machinery maintenance are often kept in fragmented spreadsheets or manual logbooks, causing booking clashes, missed renewals, and equipment downtime. **FitPulse** solves this through a centralized data architecture that tracks:
- **Member Registrations & Subscriptions:** Tiered plans, renewal dates, active status tracking.
- **Personal Trainer Faculty & Roster Allocation:** Capacity monitoring, specializations, ratings.
- **Group Fitness Class Scheduling & Enrollments:** Capacity limits, instructor assignments, real-time rosters.
- **Gym Equipment Inventory & Maintenance Ticketing:** Health statuses, inspection schedules, service logs.
- **Member Self-Service Experience:** Digital Holographic Membership Card with barcode simulation, personal coach connection, and class bookings.
- **Executive Analytics:** Live KPI statistics, monthly revenue estimations, and interactive Chart.js visualizations.

---

## 🏗️ 2. Software Architecture & Design Patterns

The project follows clean Software Engineering principles:
- **Client-Side MVC Pattern:**
  - **Model (`js/data.js`):** Encapsulates entities, default seed records, and the `DB` Data Access Object (DAO) with `localStorage` persistence.
  - **View (`index.html`, `css/styles.css`):** Semantic HTML5 layout with custom CSS variables, responsive CSS grid, modal overlays, and toast notifications.
  - **Controller (`js/app.js`):** Manages event listeners, dynamic DOM rendering, Chart.js updates, form validation, and reactive view routing.
- **Data Persistence:** Persistent browser `localStorage` engine with JSON Export/Import capabilities and a factory reset button.
- **Relational Integrity Emulation:** Member foreign keys map to Trainers (`trainerId`), and Classes map to enrolled Members (`enrolledMembers: [id1, id2]`).

---

## 📊 3. Core Functional Modules

| Module | Features & Capabilities |
| :--- | :--- |
| **1. Executive Dashboard** | Real-time KPIs (Active Members, Monthly Revenue, Class Count, Equipment Alerts), Weekly Check-in Charts, Tier Distribution Doughnut, Live Operational Activity Feed. |
| **2. Member Management** | Full CRUD, Tier Filtering (VIP Black, Premium, Standard, Basic), Expiry countdown badges, 1-Click Renewals, CSV Data Export. |
| **3. Trainer Management** | Faculty profiles, specialties (Strength, Yoga, CrossFit, HIIT), client load progress bars against max capacity, direct coach assignment. |
| **4. Fitness Classes & Scheduling** | Multi-day class schedules, room allocations, intensity levels, live roster manager, capacity validation. |
| **5. Gym Equipment & Servicing** | Equipment inventory by floor zone, operational health statuses (`Operational`, `Needs Maintenance`, `Under Repair`), 1-Click service log updates. |
| **6. Member Self-Service Portal** | Digital member pass with holographic effects and barcode, assigned coach card, class booking and cancellation. |
| **7. System Settings & Backups** | Gym profile settings, full database JSON export, JSON backup restore, seed data reset. |

---

## 🚀 4. How to Run the Website Locally

No node modules or backend build tools are required—it runs directly in any modern web browser:

1. **Direct Launch:**
   - Double-click `index.html` in Windows File Explorer, or
   - Right-click `index.html` and select **Open with Google Chrome** (or Edge/Firefox).

2. **Using VS Code Live Server (Optional):**
   - Open this folder in VS Code.
   - Click **"Go Live"** on the bottom status bar, or right-click `index.html` -> **"Open with Live Server"**.

---

## 🛠️ 5. Git & GitHub Operations Guide (For Your Assignment Submission)

Follow these exact terminal commands in PowerShell / Git Bash inside `E:\SWE_AS3` to push this project to your GitHub account:

### Step 5.1: Initialize Git Repository
```powershell
git init
```

### Step 5.2: Stage All Project Files
```powershell
git add .
```

### Step 5.3: Create Initial Commit
```powershell
git commit -m "feat: Initial release of Gym & Fitness Club Membership System"
```

### Step 5.4: Set Main Branch
```powershell
git branch -M main
```

### Step 5.5: Link to Your GitHub Repository
1. Go to [GitHub](https://github.com) and click **"New Repository"**.
2. Name it (e.g., `gym-fitness-membership-system` or `SWE_Assignment_3`).
3. Leave it public (or private per course instructions) without adding a README/license yet.
4. Copy the repository URL and run:
```powershell
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
```

### Step 5.6: Push to GitHub
```powershell
git push -u origin main
```

---

### 🌿6. Git Operations for Academic Evaluation (Branching & PRs)

If your Software Engineering course rubric grades you on git workflows (branches, merges, pull requests):

```powershell
# 1. Create a feature branch
git checkout -b feature/member-analytics

# 2. Make an edit or enhancement, then stage & commit
git add .
git commit -m "feat(analytics): add export capabilities for member records"

# 3. Push branch to GitHub
git push -u origin feature/member-analytics

# 4. Switch back to main and merge
git checkout main
git merge feature/member-analytics
git push origin main
```

---

## 📁 7. Project Structure

```text
SWE_AS3/
├── index.html              # Main HTML5 application shell & view templates
├── css/
│   └── styles.css          # Dark athletic UI stylesheet, animations, and responsive layout
├── js/
│   ├── data.js             # Data models, seed records, LocalStorage DAO & activity logger
│   └── app.js              # Application controller, routing, CRUD, Chart.js integrations
├── assets/                 # Folder for local images and static assets (if needed)
└── README.md               # Project documentation and Git guide
```





