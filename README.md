# FitPulse | Gym & Fitness Club Membership System | Small progress is still progress💪🏼
> **Course:** Software Engineering (SWE) Course Assignment  
> **Project:** Centralized Gym & Fitness Club Membership Management System  
> **Architecture:** 3-Tier Client-Server Architecture  
> **Tech Stack:**
> - **Frontend (Presentation Tier):** HTML5, CSS3 (Athletic Glassmorphism & Responsive Layout), JavaScript (ES6+), Chart.js, FontAwesome 6
> - **Backend (Application Tier):** Node.js (v24), Express.js 5 REST API, CORS
> - **Database (Data Tier):** SQLite3 (`fitpulse.db`), Relational Schema with Foreign Keys, ACID Transactions

---

## 📌 1. Project Overview & Problem Statement

The **Gym/Fitness Club Membership System (FitPulse)** is a comprehensive full-stack software application designed to simplify and automate the daily administrative and member-facing operations of a modern fitness center. 

In traditional fitness centers, records for members, subscriptions, trainers, classes, and machinery maintenance are often kept in fragmented spreadsheets or manual logbooks, causing booking clashes, missed renewals, and equipment downtime. **FitPulse** solves this through a centralized relational database architecture that tracks:
- **Member Registrations & Subscriptions:** Tiered plans (VIP Black, Premium, Standard, Basic), renewal dates, active status tracking.
- **Personal Trainer Faculty & Roster Allocation:** Capacity monitoring, specializations, hourly rates, client load tracking.
- **Group Fitness Class Scheduling & Enrollments:** Capacity limits, instructor assignments, many-to-many member enrollment junction.
- **Gym Equipment Inventory & Maintenance Ticketing:** Health statuses, inspection schedules, service logs.
- **Member Self-Service Experience:** Digital Holographic Membership Card with barcode simulation, personal coach connection, and class bookings.
- **Executive Analytics:** Live KPI statistics, monthly revenue estimations, and interactive Chart.js visualizations.
- **Interactive Backend & Database Inspector:** Built-in SQL query runner for academic presentation demonstration.

---

## 🏗️ 2. 3-Tier Software Architecture & Design Patterns

```text
┌────────────────────────────────────────────────────────┐
│             PRESENTATION TIER (Frontend)               │
│  HTML5 + CSS3 + Vanilla ES6 JS + Chart.js Analytics     │
│  • Single Page Application (SPA) Views                │
│  • Dynamic Initials Avatars & Holographic Pass         │
│  • Built-in Live SQL Query Console Modal               │
└───────────────────────────▲────────────────────────────┘
                            │ HTTP REST / JSON
┌───────────────────────────▼────────────────────────────┐
│              APPLICATION TIER (Backend API)             │
│  Node.js (v24) + Express.js 5 Server (Port 3000)       │
│  • Static File Serving (http://localhost:3000)         │
│  • REST API Endpoints (/api/members, /api/classes...)  │
│  • Live Request Logger for Presentation Terminal       │
│  • Atomic State Sync & SQL Execution Handler           │
└───────────────────────────▲────────────────────────────┘
                            │ Native DatabaseSync API
┌───────────────────────────▼────────────────────────────┐
│                DATABASE TIER (Data Layer)              │
│  SQLite3 Relational Database Engine (fitpulse.db)      │
│  • Relational Schema with Primary & Foreign Keys       │
│  • Junction Table (class_enrollments) for M:N Mapping   │
│  • ACID Compliant Transactions (BEGIN / COMMIT)        │
└────────────────────────────────────────────────────────┘
```

### Key Software Engineering Design Patterns:
1. **Multi-Tier Client-Server Pattern:** Separation of Concerns between presentation, business logic, and relational persistence.
2. **Data Access Object (DAO) Pattern (`database.js` & `js/data.js`):** Abstraction layer isolating SQL queries from controller logic.
3. **Hybrid Resilience / Fallback Strategy:** The frontend connects directly to the Node.js/SQLite backend; if offline, it gracefully falls back to browser `localStorage` without breaking user flow.

---

## 🗄️ 3. Relational Database Schema (`fitpulse.db`)

FitPulse enforces relational referential integrity using SQLite foreign key constraints:

### 1. `settings` Table
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY CHECK(id=1) | Singleton record |
| `gymName` | TEXT | NOT NULL | Club name |
| `address` | TEXT | NOT NULL | Chennai facility address |
| `phone` | TEXT | NOT NULL | Indian contact number |
| `email` | TEXT | NOT NULL | Support email |
| `currency` | TEXT | NOT NULL | Currency symbol (₹) |
| `taxRate` | REAL | NOT NULL | GST rate (18%) |
| `operatingHours`| TEXT | NOT NULL | Working hours |

### 2. `trainers` Table
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | TEXT | PRIMARY KEY | Trainer identifier (e.g., `trn-1`) |
| `code` | TEXT | UNIQUE, NOT NULL | Faculty badge code (`TR-201`) |
| `name` | TEXT | NOT NULL | Coach name (`Jishnu`, `Deepak SB`, `Vishwak`) |
| `email` | TEXT | - | Contact email |
| `phone` | TEXT | - | Indian mobile number |
| `specialization`| TEXT| - | Focus area (Strength, Mobility, CrossFit) |
| `experienceYears`|INTEGER| - | Years of coaching |
| `rating` | REAL | - | Student rating (1.0 - 5.0) |
| `maxClients` | INTEGER | - | Client limit |
| `hourlyRate` | REAL | - | Hourly training fee in ₹ |
| `bio` | TEXT | - | Coach biography |

### 3. `members` Table
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | TEXT | PRIMARY KEY | Member identifier (e.g., `mem-1`) |
| `code` | TEXT | UNIQUE, NOT NULL | Member barcode (`FP-1001`) |
| `name` | TEXT | NOT NULL | Teammates (`Srihari V R`, `Deepan S`, `Krishna Prakash J`, `Kaushik Balasundaram`) |
| `email` | TEXT | - | Personal email |
| `phone` | TEXT | - | Indian mobile (+91) |
| `gender` | TEXT | - | Gender |
| `age` | INTEGER | - | Member age |
| `tier` | TEXT | - | VIP Black, Premium, Standard, Basic |
| `status` | TEXT | - | Active, Expiring Soon, Inactive |
| `startDate` | TEXT | - | Membership start |
| `expiryDate` | TEXT | - | Membership expiry |
| `trainerId` | TEXT | REFERENCES trainers(id) | Assigned personal coach (Foreign Key) |
| `emergencyContact`| TEXT| - | Emergency phone number |
| `notes` | TEXT | - | Fitness goals & health notes |

### 4. `classes` Table
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | TEXT | PRIMARY KEY | Class identifier (`cls-1`) |
| `code` | TEXT | UNIQUE, NOT NULL | Schedule code (`CLS-301`) |
| `title` | TEXT | NOT NULL | Class name |
| `category` | TEXT | - | HIIT, Strength, Yoga, Cardio, CrossFit |
| `trainerId` | TEXT | REFERENCES trainers(id) | Assigned instructor (Foreign Key) |
| `dayOfWeek` | TEXT | - | Scheduled weekdays |
| `time` | TEXT | - | Time slot |
| `duration` | INTEGER | - | Minutes |
| `room` | TEXT | - | Gym studio room |
| `maxCapacity`| INTEGER | - | Capacity cap |
| `intensity` | TEXT | - | Moderate, High, Extreme |
| `description`| TEXT | - | Class focus description |
| `banner` | TEXT | - | Cover image |

### 5. `class_enrollments` Table (Many-to-Many Junction)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `classId` | TEXT | REFERENCES classes(id) ON DELETE CASCADE | Target class (Composite PK) |
| `memberId` | TEXT | REFERENCES members(id) ON DELETE CASCADE | Enrolled member (Composite PK) |
| `enrolledAt`| TEXT | DEFAULT (datetime('now')) | Registration timestamp |

### 6. `equipment` Table
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | TEXT | PRIMARY KEY | Gear identifier (`eq-1`) |
| `code` | TEXT | UNIQUE, NOT NULL | Asset inventory tag (`EQ-401`) |
| `name` | TEXT | NOT NULL | Equipment model name |
| `category` | TEXT | - | Free Weights, Cardio, Resistance |
| `zone` | TEXT | - | Facility floor zone |
| `brand` | TEXT | - | Manufacturer |
| `serialNo` | TEXT | - | Manufacturer serial number |
| `purchaseDate`| TEXT | - | Purchase date |
| `lastServiceDate`| TEXT| - | Previous maintenance |
| `nextServiceDate`| TEXT| - | Next maintenance due |
| `status` | TEXT | - | `Operational`, `Needs Maintenance`, `Under Repair` |
| `condition` | TEXT | - | Physical diagnosis |
| `notes` | TEXT | - | Maintenance remarks |

### 7. `activities` Table
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | TEXT | PRIMARY KEY | Activity log identifier |
| `timestamp` | TEXT | NOT NULL | YYYY-MM-DD HH:MM |
| `type` | TEXT | NOT NULL | member, trainer, class, equipment, subscription |
| `title` | TEXT | NOT NULL | Activity heading |
| `description`| TEXT | NOT NULL | Detailed action log |
| `icon` | TEXT | NOT NULL | FontAwesome icon class |

---

## 📡 4. Backend REST API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/status` | Server health check, uptime, and database file statistics |
| `GET` | `/api/data` | Complete application state bundle |
| `POST` | `/api/sync` | Full frontend-to-database state synchronization transaction |
| `POST` | `/api/reset` | Resets SQLite database back to seed defaults |
| `POST` | `/api/sql` | **Live SQL query executor** for academic presentation demos |
| `GET` | `/api/members` | Retrieve all registered members |
| `POST` | `/api/members` | Register a new member |
| `GET` | `/api/members/:id` | Fetch single member by ID |
| `PUT` | `/api/members/:id` | Update member record |
| `POST` | `/api/members/:id/renew` | Extend subscription expiry date by 1 year |
| `DELETE`| `/api/members/:id` | Remove member from database |
| `GET` | `/api/trainers` | Retrieve all trainer faculty |
| `POST` | `/api/trainers` | Add new coach to faculty |
| `PUT` | `/api/trainers/:id` | Update trainer profile |
| `DELETE`| `/api/trainers/:id` | Remove trainer |
| `GET` | `/api/classes` | Fetch all fitness classes with enrolled member IDs |
| `POST` | `/api/classes` | Create new scheduled class |
| `POST` | `/api/classes/:id/enroll` | Enroll member in class (adds to `class_enrollments`) |
| `POST` | `/api/classes/:id/unenroll`| Drop member from class |
| `GET` | `/api/equipment` | Retrieve all facility equipment records |
| `POST` | `/api/equipment` | Add new equipment asset |
| `PUT` | `/api/equipment/:id` | Update equipment status and service dates |
| `DELETE`| `/api/equipment/:id` | Decommission equipment |

---

## 🚀 5. How to Run the Project for Tomorrow's Presentation

### Step 1: Open Terminal in the Project Directory
Open PowerShell or Command Prompt in `E:\SWE_AS3`:
```powershell
cd E:\SWE_AS3
```

### Step 2: Start the Backend REST API Server
```powershell
npm start
```
*(Or run `node server.js`)*

You will see the startup banner:
```text
=======================================================
🏋️ FITPULSE GYM MANAGEMENT BACKEND SERVER RUNNING
📡 URL: http://localhost:3000
🗄️ Database: SQLite3 (fitpulse.db)
⚡ Endpoints:
   - GET  /api/status     (System & DB Stats)
   - GET  /api/data       (Full Data Bundle)
   - GET  /api/members    (Member CRUD)
   - GET  /api/trainers   (Trainer CRUD)
   - GET  /api/classes    (Class CRUD & Enrollment)
   - GET  /api/equipment  (Equipment Records)
   - POST /api/sql        (Live SQL Demo Runner)
=======================================================
```

### Step 3: Open the Web Application in Your Browser
Visit:
👉 **`http://localhost:3000`**

The web app will automatically connect to the backend server and display the green **`🟢 SQLite3 (Port 3000)`** status indicator!

---

## 🎤 6. Step-by-Step Presentation Guide (To Show Professors & Examiners)

When demonstrating to your professors:

1. **Show the 3-Tier Architecture:**
   - Explain how the frontend talks to the Node.js Express REST API, which reads and writes to the SQLite database file (`fitpulse.db`).
   - Show the terminal running `npm start`, where every click in the app prints a real-time HTTP log:
     ```text
     [API] 10:40:22 PM GET /api/members -> 200 (5ms)
     [API] 10:40:25 PM POST /api/members -> 201 (12ms)
     ```

2. **Open the "Backend & Database Inspector" Modal:**
   - In the top header or sidebar, click the **`🟢 SQLite3 (Port 3000)`** button or **"Backend & Database"** in the sidebar.
   - Show the live database file size (`72 KB`), table row counts, and the relational schema with foreign keys.

3. **Demonstrate Live SQL Queries:**
   - Inside the Inspector modal, show the **Live SQL Query Console**:
   - Click the quick buttons or type custom queries:
     - `SELECT name, tier, phone, status FROM members;`
     - `SELECT name, specialization, hourlyRate, rating FROM trainers;`
     - `SELECT c.title, c.dayOfWeek, t.name as trainer FROM classes c LEFT JOIN trainers t ON c.trainerId = t.id;` *(Shows SQL JOIN!)*
     - `SELECT status, COUNT(*) as total_units FROM equipment GROUP BY status;` *(Shows SQL GROUP BY!)*
   - Click **"Execute SQL"** to show instant live results directly queried from `fitpulse.db`!

4. **Show Real-Time CRUD Operations:**
   - Add a new member or update equipment in the webpage.
   - Run `SELECT * FROM members;` in the SQL console or terminal to show that the record was instantly stored in the SQLite database.

5. **Demonstrate Resilience (Offline LocalStorage Fallback):**
   - Point out that even if the backend is stopped, the application gracefully continues functioning with cached `localStorage`, ensuring zero presentation failure risk.

---

## 🛠️ 7. Git & GitHub Operations (Assignment Submission)

Follow these terminal commands in `E:\SWE_AS3` to commit and push your completed backend and database code to GitHub:

### Check Status & Stage Files
```powershell
git status
git add .
```

### Commit Changes
```powershell
git commit -m "feat: implement 3-tier architecture with Express REST API and SQLite relational database"
```

### Push to GitHub
```powershell
git push origin main
```

---

## 📁 8. Project Directory Structure

```text
SWE_AS3/
├── database.js             # SQLite3 database service, schema definition, and seed data
├── fitpulse.db             # Relational SQLite database file (ACID-compliant storage)
├── server.js               # Node.js Express REST API server & static file host
├── package.json            # Project manifest & npm scripts
├── .gitignore              # Ignores node_modules
├── index.html              # Main HTML5 application shell & view templates
├── css/
│   └── styles.css          # Dark athletic UI stylesheet, animations, and DB inspector styles
├── js/
│   ├── data.js             # Client DAO with REST API sync & LocalStorage fallback
│   └── app.js              # Application controller, routing, CRUD, Chart.js, & SQL console
├── assets/                 # Folder for local assets (if needed)
└── README.md               # Complete architecture documentation & presentation guide
```
