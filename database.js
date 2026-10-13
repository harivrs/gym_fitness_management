/**
 * FitPulse Gym & Fitness Club Membership System
 * Database Layer - SQLite3 Relational Database Engine (fitpulse.db)
 * Powered by Node.js native DatabaseSync (node:sqlite)
 */

const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

const DB_PATH = path.join(__dirname, 'fitpulse.db');

// Connect to SQLite Database
const db = new DatabaseSync(DB_PATH);

// Enable foreign key enforcement & WAL journal mode for performance
db.exec(`
  PRAGMA foreign_keys = ON;
`);

/**
 * Initialize Tables Schema
 */
function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      gymName TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      currency TEXT NOT NULL,
      taxRate REAL NOT NULL,
      operatingHours TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS trainers (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      specialization TEXT,
      experienceYears INTEGER,
      rating REAL,
      maxClients INTEGER,
      hourlyRate REAL,
      bio TEXT
    );

    CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      gender TEXT,
      age INTEGER,
      tier TEXT,
      status TEXT,
      startDate TEXT,
      expiryDate TEXT,
      trainerId TEXT,
      emergencyContact TEXT,
      notes TEXT,
      FOREIGN KEY (trainerId) REFERENCES trainers(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS classes (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      category TEXT,
      trainerId TEXT,
      dayOfWeek TEXT,
      time TEXT,
      duration INTEGER,
      room TEXT,
      maxCapacity INTEGER,
      intensity TEXT,
      description TEXT,
      banner TEXT,
      FOREIGN KEY (trainerId) REFERENCES trainers(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS class_enrollments (
      classId TEXT NOT NULL,
      memberId TEXT NOT NULL,
      enrolledAt TEXT DEFAULT (datetime('now')),
      PRIMARY KEY (classId, memberId),
      FOREIGN KEY (classId) REFERENCES classes(id) ON DELETE CASCADE,
      FOREIGN KEY (memberId) REFERENCES members(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS equipment (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      category TEXT,
      zone TEXT,
      brand TEXT,
      serialNo TEXT,
      purchaseDate TEXT,
      lastServiceDate TEXT,
      nextServiceDate TEXT,
      status TEXT,
      condition TEXT,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL
    );
  `);
}

/**
 * Default Seed Data (Team Members, Chennai Location, Indian Numbers)
 */
const SEED_DATA = {
  settings: {
    gymName: "FitPulse Titan Performance Arena",
    address: "67 Anna Salai, Guindy Industrial Estate, Chennai, Tamil Nadu - 600032",
    phone: "+91 (044) 2235-8900",
    email: "support@fitpulse-chennai.in",
    currency: "₹",
    taxRate: 18,
    operatingHours: "05:30 AM - 10:30 PM (Daily)"
  },
  trainers: [
    {
      id: "trn-1",
      code: "TR-201",
      name: "Jishnu",
      email: "jishnu@fitpulse-chennai.in",
      phone: "+91 99620 45678",
      specialization: "Strength & Hypertrophy Coach",
      experienceYears: 8,
      rating: 4.95,
      maxClients: 15,
      hourlyRate: 1200,
      bio: "Certified national strength specialist focused on progressive overload, barbell power mechanics, and athletic hypertrophy."
    },
    {
      id: "trn-2",
      code: "TR-202",
      name: "Deepak SB",
      email: "deepak.sb@fitpulse-chennai.in",
      phone: "+91 98412 34567",
      specialization: "Functional Movement & Mobility",
      experienceYears: 7,
      rating: 4.9,
      maxClients: 20,
      hourlyRate: 1000,
      bio: "Movement specialist emphasizing joint longevity, postural correction, mobility endurance, and high-intensity interval conditioning."
    },
    {
      id: "trn-3",
      code: "TR-203",
      name: "Vishwak",
      email: "vishwak@fitpulse-chennai.in",
      phone: "+91 97100 89012",
      specialization: "CrossFit & Athletic Conditioning",
      experienceYears: 6,
      rating: 4.85,
      maxClients: 18,
      hourlyRate: 1100,
      bio: "Certified CrossFit coach delivering intense metabolic conditioning, kettlebell circuits, and explosive sprint capacity."
    }
  ],
  members: [
    {
      id: "mem-1",
      code: "FP-1001",
      name: "Srihari V R",
      email: "srihari.vr@example.com",
      phone: "+91 98401 23456",
      gender: "Male",
      age: 21,
      tier: "VIP Black",
      status: "Active",
      startDate: "2026-01-15",
      expiryDate: "2027-01-15",
      trainerId: "trn-1",
      emergencyContact: "+91 98401 98765",
      notes: "Focus on hypertrophy & explosive athletic conditioning. Advanced barbell work."
    },
    {
      id: "mem-2",
      code: "FP-1002",
      name: "Deepan S",
      email: "deepan.s@example.com",
      phone: "+91 94440 87654",
      gender: "Male",
      age: 21,
      tier: "Premium",
      status: "Active",
      startDate: "2026-02-01",
      expiryDate: "2026-11-01",
      trainerId: "trn-2",
      emergencyContact: "+91 94440 12345",
      notes: "Cardio endurance, 10K marathon preparation, and core functional mobility."
    },
    {
      id: "mem-3",
      code: "FP-1003",
      name: "Krishna Prakash J",
      email: "krishna.prakash@example.com",
      phone: "+91 98842 11234",
      gender: "Male",
      age: 22,
      tier: "Standard",
      status: "Expiring Soon",
      startDate: "2025-10-10",
      expiryDate: "2026-10-10",
      trainerId: "trn-3",
      emergencyContact: "+91 98842 99887",
      notes: "Powerlifting progression: Squat, Bench Press, and Deadlift biomechanics."
    },
    {
      id: "mem-4",
      code: "FP-1004",
      name: "Kaushik Balasundaram",
      email: "kaushik.bala@example.com",
      phone: "+91 97910 56789",
      gender: "Male",
      age: 21,
      tier: "VIP Black",
      status: "Active",
      startDate: "2026-03-01",
      expiryDate: "2027-03-01",
      trainerId: "trn-1",
      emergencyContact: "+91 97910 44321",
      notes: "High intensity functional agility and upper-body strength conditioning."
    }
  ],
  classes: [
    {
      id: "cls-1",
      code: "CLS-301",
      title: "Dawn Shred: HIIT Blitz",
      category: "HIIT",
      trainerId: "trn-2",
      dayOfWeek: "Monday, Wednesday, Friday",
      time: "06:30 AM - 07:30 AM",
      duration: 60,
      room: "Studio Alpha (Floor 2)",
      maxCapacity: 16,
      intensity: "High",
      enrolledMembers: ["mem-1", "mem-2"],
      description: "Heart-pounding interval circuits combining battle ropes, plyometrics, and assault bike sprints.",
      banner: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "cls-2",
      code: "CLS-302",
      title: "Iron Core Powerlifting Lab",
      category: "Strength",
      trainerId: "trn-1",
      dayOfWeek: "Tuesday, Thursday",
      time: "05:30 PM - 06:45 PM",
      duration: 75,
      room: "Barbell Pit (Zone A)",
      maxCapacity: 10,
      intensity: "Extreme",
      enrolledMembers: ["mem-1", "mem-3"],
      description: "Deep dive into barbell biomechanics, squat depth, bench arches, and deadlift lockout power.",
      banner: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "cls-3",
      code: "CLS-303",
      title: "Zenith Mobility & Core Flow",
      category: "Yoga",
      trainerId: "trn-2",
      dayOfWeek: "Monday, Thursday, Saturday",
      time: "08:00 AM - 09:00 AM",
      duration: 60,
      room: "Zen Studio (Floor 3)",
      maxCapacity: 20,
      intensity: "Moderate",
      enrolledMembers: ["mem-2", "mem-4"],
      description: "Functional mobility circuits, deep hip openers, thoracic spine relief, and core stamina.",
      banner: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "cls-4",
      code: "CLS-304",
      title: "Velocity Spin & RPM Ride",
      category: "Cardio",
      trainerId: "trn-3",
      dayOfWeek: "Wednesday, Friday",
      time: "06:00 PM - 07:00 PM",
      duration: 60,
      room: "Cycle Arena (Floor 1)",
      maxCapacity: 18,
      intensity: "High",
      enrolledMembers: ["mem-3", "mem-4"],
      description: "Rhythm-based high cadence cycling with hill climbs, interval sprints, and recovery blocks.",
      banner: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "cls-5",
      code: "CLS-305",
      title: "WOD Beast CrossFit Arena",
      category: "CrossFit",
      trainerId: "trn-3",
      dayOfWeek: "Saturday, Sunday",
      time: "10:00 AM - 11:30 AM",
      duration: 90,
      room: "CrossFit Box (Zone C)",
      maxCapacity: 12,
      intensity: "Extreme",
      enrolledMembers: ["mem-1", "mem-4"],
      description: "Team and solo workouts of the day with kettlebells, wall balls, box jumps, and Olympic snatches.",
      banner: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80"
    }
  ],
  equipment: [
    {
      id: "eq-1",
      code: "EQ-401",
      name: "Matrix Ultra Olympic Power Rack #1",
      category: "Free Weights",
      zone: "Zone A - Free Weights Arena",
      brand: "Matrix Fitness",
      serialNo: "MX-PR-88910",
      purchaseDate: "2024-03-10",
      lastServiceDate: "2026-07-15",
      nextServiceDate: "2026-10-15",
      status: "Operational",
      condition: "Excellent",
      notes: "Safety catches and pull-up bar inspected regularly."
    },
    {
      id: "eq-2",
      code: "EQ-402",
      name: "LifeFitness Discover SE3 Treadmill #4",
      category: "Cardio",
      zone: "Floor 1 - Cardio Deck",
      brand: "LifeFitness",
      serialNo: "LF-TM-20931",
      purchaseDate: "2024-06-20",
      lastServiceDate: "2026-08-01",
      nextServiceDate: "2026-10-05",
      status: "Needs Maintenance",
      condition: "Belt Slip Warning",
      notes: "Running belt requires tension adjustment and lubrication."
    },
    {
      id: "eq-3",
      code: "EQ-403",
      name: "Concept2 RowErg Model D",
      category: "Cardio",
      zone: "Zone C - Functional & CrossFit Turf",
      brand: "Concept2",
      serialNo: "C2-RW-44120",
      purchaseDate: "2025-01-18",
      lastServiceDate: "2026-09-02",
      nextServiceDate: "2026-12-02",
      status: "Operational",
      condition: "Pristine",
      notes: "Chain oiled and PM5 monitor calibrated."
    },
    {
      id: "eq-4",
      code: "EQ-404",
      name: "Hammer Strength Plate-Loaded Leg Press",
      category: "Resistance",
      zone: "Zone B - Strength & Resistance Deck",
      brand: "Hammer Strength",
      serialNo: "HS-LP-77641",
      purchaseDate: "2023-11-05",
      lastServiceDate: "2026-06-10",
      nextServiceDate: "2026-09-10",
      status: "Under Repair",
      condition: "Hydraulic Stopper Issue",
      notes: "Awaiting replacement bushing from manufacturer dispatch."
    },
    {
      id: "eq-5",
      code: "EQ-405",
      name: "Eleiko Competition Barbell & Bumper Plate Set",
      category: "Free Weights",
      zone: "Zone A - Free Weights Arena",
      brand: "Eleiko Sweden",
      serialNo: "EL-BB-10992",
      purchaseDate: "2025-04-01",
      lastServiceDate: "2026-08-20",
      nextServiceDate: "2026-11-20",
      status: "Operational",
      condition: "Excellent",
      notes: "Needle bearing rotation spin tested: optimal."
    },
    {
      id: "eq-6",
      code: "EQ-406",
      name: "Keiser M3i Indoor Cycle #8",
      category: "Cardio",
      zone: "Studio 1 - Group Aerobics & Spin",
      brand: "Keiser",
      serialNo: "KS-IC-55091",
      purchaseDate: "2024-09-15",
      lastServiceDate: "2026-05-14",
      nextServiceDate: "2026-08-14",
      status: "Needs Maintenance",
      condition: "Pedal Sensor Drift",
      notes: "Bluetooth resistance sensor needs calibration."
    },
    {
      id: "eq-7",
      code: "EQ-407",
      name: "Cable Crossover Multi-Station 8-Stack",
      category: "Resistance",
      zone: "Zone B - Strength & Resistance Deck",
      brand: "Precor Commercial",
      serialNo: "PR-JG-33012",
      purchaseDate: "2024-01-20",
      lastServiceDate: "2026-09-01",
      nextServiceDate: "2026-12-01",
      status: "Operational",
      condition: "Good",
      notes: "All cables replaced and pulleys lubricated."
    }
  ],
  activities: [
    {
      id: "act-1",
      timestamp: "2026-09-29 18:40",
      type: "member",
      title: "New Member Registered",
      description: "Srihari V R registered under VIP Black tier.",
      icon: "fa-user-plus"
    },
    {
      id: "act-2",
      timestamp: "2026-09-29 17:15",
      type: "class",
      title: "Class Enrollment",
      description: "Kaushik Balasundaram enrolled in WOD Beast CrossFit Arena.",
      icon: "fa-calendar-check"
    },
    {
      id: "act-3",
      timestamp: "2026-09-29 15:30",
      type: "equipment",
      title: "Maintenance Ticket Created",
      description: "LifeFitness Discover SE3 Treadmill flagged for belt slip.",
      icon: "fa-wrench"
    },
    {
      id: "act-4",
      timestamp: "2026-09-29 14:05",
      type: "trainer",
      title: "Trainer Assigned",
      description: "Deepak SB assigned to Deepan S.",
      icon: "fa-dumbbell"
    },
    {
      id: "act-5",
      timestamp: "2026-09-29 11:20",
      type: "subscription",
      title: "Renewal Notification",
      description: "Krishna Prakash J subscription status flagged: Expiring Soon.",
      icon: "fa-clock"
    }
  ]
};

/**
 * Seed Database with Initial Data
 */
function seedDatabase(force = false) {
  const memberCount = db.prepare('SELECT COUNT(*) as count FROM members').get().count;
  if (memberCount > 0 && !force) {
    return; // Already seeded
  }

  // Clear existing
  db.exec(`
    DELETE FROM class_enrollments;
    DELETE FROM classes;
    DELETE FROM members;
    DELETE FROM trainers;
    DELETE FROM equipment;
    DELETE FROM activities;
    DELETE FROM settings;
  `);

  // Settings
  const s = SEED_DATA.settings;
  db.prepare(`
    INSERT INTO settings (id, gymName, address, phone, email, currency, taxRate, operatingHours)
    VALUES (1, ?, ?, ?, ?, ?, ?, ?)
  `).run(s.gymName, s.address, s.phone, s.email, s.currency, s.taxRate, s.operatingHours);

  // Trainers
  const insertTrainer = db.prepare(`
    INSERT INTO trainers (id, code, name, email, phone, specialization, experienceYears, rating, maxClients, hourlyRate, bio)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const t of SEED_DATA.trainers) {
    insertTrainer.run(t.id, t.code, t.name, t.email, t.phone, t.specialization, t.experienceYears, t.rating, t.maxClients, t.hourlyRate, t.bio);
  }

  // Members
  const insertMember = db.prepare(`
    INSERT INTO members (id, code, name, email, phone, gender, age, tier, status, startDate, expiryDate, trainerId, emergencyContact, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const m of SEED_DATA.members) {
    insertMember.run(m.id, m.code, m.name, m.email, m.phone, m.gender, m.age, m.tier, m.status, m.startDate, m.expiryDate, m.trainerId, m.emergencyContact, m.notes);
  }

  // Classes & Enrollments
  const insertClass = db.prepare(`
    INSERT INTO classes (id, code, title, category, trainerId, dayOfWeek, time, duration, room, maxCapacity, intensity, description, banner)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertEnrollment = db.prepare(`
    INSERT INTO class_enrollments (classId, memberId) VALUES (?, ?)
  `);

  for (const c of SEED_DATA.classes) {
    insertClass.run(c.id, c.code, c.title, c.category, c.trainerId, c.dayOfWeek, c.time, c.duration, c.room, c.maxCapacity, c.intensity, c.description, c.banner);
    if (c.enrolledMembers && Array.isArray(c.enrolledMembers)) {
      for (const mId of c.enrolledMembers) {
        insertEnrollment.run(c.id, mId);
      }
    }
  }

  // Equipment
  const insertEquipment = db.prepare(`
    INSERT INTO equipment (id, code, name, category, zone, brand, serialNo, purchaseDate, lastServiceDate, nextServiceDate, status, condition, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const e of SEED_DATA.equipment) {
    insertEquipment.run(e.id, e.code, e.name, e.category, e.zone, e.brand, e.serialNo, e.purchaseDate, e.lastServiceDate, e.nextServiceDate, e.status, e.condition, e.notes);
  }

  // Activities
  const insertActivity = db.prepare(`
    INSERT INTO activities (id, timestamp, type, title, description, icon)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  for (const a of SEED_DATA.activities) {
    insertActivity.run(a.id, a.timestamp, a.type, a.title, a.description, a.icon);
  }

  console.log('✅ SQLite database initialized and seeded successfully.');
}

// Ensure schema & seed are executed on load
initSchema();
seedDatabase();

/**
 * Data Access Object Implementation
 */
const DatabaseService = {
  getSettings() {
    const row = db.prepare('SELECT * FROM settings WHERE id = 1').get();
    if (!row) return SEED_DATA.settings;
    const { id, ...cleanSettings } = row;
    return cleanSettings;
  },

  updateSettings(settings) {
    db.prepare(`
      UPDATE settings
      SET gymName = ?, address = ?, phone = ?, email = ?, currency = ?, taxRate = ?, operatingHours = ?
      WHERE id = 1
    `).run(
      settings.gymName || "FitPulse Titan Performance Arena",
      settings.address || "",
      settings.phone || "",
      settings.email || "",
      settings.currency || "₹",
      settings.taxRate || 18,
      settings.operatingHours || ""
    );
    return this.getSettings();
  },

  // Members
  getMembers() {
    return db.prepare('SELECT * FROM members ORDER BY id ASC').all();
  },

  getMemberById(id) {
    return db.prepare('SELECT * FROM members WHERE id = ?').get(id);
  },

  createMember(m) {
    const id = m.id || ('mem-' + Date.now());
    const count = db.prepare('SELECT COUNT(*) as count FROM members').get().count;
    const code = m.code || `FP-${1001 + count}`;
    db.prepare(`
      INSERT INTO members (id, code, name, email, phone, gender, age, tier, status, startDate, expiryDate, trainerId, emergencyContact, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      code,
      m.name,
      m.email || '',
      m.phone || '',
      m.gender || 'Other',
      m.age || 20,
      m.tier || 'Standard',
      m.status || 'Active',
      m.startDate || new Date().toISOString().split('T')[0],
      m.expiryDate || new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0],
      m.trainerId || null,
      m.emergencyContact || '',
      m.notes || ''
    );
    return this.getMemberById(id);
  },

  updateMember(id, m) {
    db.prepare(`
      UPDATE members
      SET name = ?, email = ?, phone = ?, gender = ?, age = ?, tier = ?, status = ?,
          startDate = ?, expiryDate = ?, trainerId = ?, emergencyContact = ?, notes = ?
      WHERE id = ?
    `).run(
      m.name,
      m.email || '',
      m.phone || '',
      m.gender || 'Other',
      m.age || 20,
      m.tier || 'Standard',
      m.status || 'Active',
      m.startDate,
      m.expiryDate,
      m.trainerId || null,
      m.emergencyContact || '',
      m.notes || '',
      id
    );
    return this.getMemberById(id);
  },

  renewMember(id, newExpiryDate) {
    db.prepare(`
      UPDATE members
      SET expiryDate = ?, status = 'Active'
      WHERE id = ?
    `).run(newExpiryDate, id);
    return this.getMemberById(id);
  },

  deleteMember(id) {
    db.prepare('DELETE FROM members WHERE id = ?').run(id);
    return { success: true, deletedId: id };
  },

  // Trainers
  getTrainers() {
    return db.prepare('SELECT * FROM trainers ORDER BY id ASC').all();
  },

  getTrainerById(id) {
    return db.prepare('SELECT * FROM trainers WHERE id = ?').get(id);
  },

  createTrainer(t) {
    const id = t.id || ('trn-' + Date.now());
    const count = db.prepare('SELECT COUNT(*) as count FROM trainers').get().count;
    const code = t.code || `TR-${201 + count}`;
    db.prepare(`
      INSERT INTO trainers (id, code, name, email, phone, specialization, experienceYears, rating, maxClients, hourlyRate, bio)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      code,
      t.name,
      t.email || '',
      t.phone || '',
      t.specialization || 'Fitness Trainer',
      t.experienceYears || 1,
      t.rating || 4.8,
      t.maxClients || 15,
      t.hourlyRate || 1000,
      t.bio || ''
    );
    return this.getTrainerById(id);
  },

  updateTrainer(id, t) {
    db.prepare(`
      UPDATE trainers
      SET name = ?, email = ?, phone = ?, specialization = ?, experienceYears = ?,
          rating = ?, maxClients = ?, hourlyRate = ?, bio = ?
      WHERE id = ?
    `).run(
      t.name,
      t.email || '',
      t.phone || '',
      t.specialization || 'Fitness Trainer',
      t.experienceYears || 1,
      t.rating || 4.8,
      t.maxClients || 15,
      t.hourlyRate || 1000,
      t.bio || '',
      id
    );
    return this.getTrainerById(id);
  },

  deleteTrainer(id) {
    db.prepare('DELETE FROM trainers WHERE id = ?').run(id);
    return { success: true, deletedId: id };
  },

  // Classes
  getClasses() {
    const classes = db.prepare('SELECT * FROM classes ORDER BY id ASC').all();
    const enrollments = db.prepare('SELECT classId, memberId FROM class_enrollments').all();
    
    // Attach enrolled members array
    return classes.map(cls => {
      const enrolled = enrollments.filter(e => e.classId === cls.id).map(e => e.memberId);
      return {
        ...cls,
        enrolledMembers: enrolled
      };
    });
  },

  getClassById(id) {
    const cls = db.prepare('SELECT * FROM classes WHERE id = ?').get(id);
    if (!cls) return null;
    const enrolled = db.prepare('SELECT memberId FROM class_enrollments WHERE classId = ?').all(id).map(e => e.memberId);
    return {
      ...cls,
      enrolledMembers: enrolled
    };
  },

  createClass(c) {
    const id = c.id || ('cls-' + Date.now());
    const count = db.prepare('SELECT COUNT(*) as count FROM classes').get().count;
    const code = c.code || `CLS-${301 + count}`;
    db.prepare(`
      INSERT INTO classes (id, code, title, category, trainerId, dayOfWeek, time, duration, room, maxCapacity, intensity, description, banner)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      code,
      c.title,
      c.category || 'Fitness',
      c.trainerId || null,
      c.dayOfWeek || 'Mon, Wed, Fri',
      c.time || '07:00 AM - 08:00 AM',
      c.duration || 60,
      c.room || 'Studio A',
      c.maxCapacity || 20,
      c.intensity || 'Moderate',
      c.description || '',
      c.banner || 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80'
    );
    if (c.enrolledMembers && Array.isArray(c.enrolledMembers)) {
      const enroll = db.prepare('INSERT OR IGNORE INTO class_enrollments (classId, memberId) VALUES (?, ?)');
      for (const mId of c.enrolledMembers) {
        enroll.run(id, mId);
      }
    }
    return this.getClassById(id);
  },

  updateClass(id, c) {
    db.prepare(`
      UPDATE classes
      SET title = ?, category = ?, trainerId = ?, dayOfWeek = ?, time = ?, duration = ?,
          room = ?, maxCapacity = ?, intensity = ?, description = ?, banner = ?
      WHERE id = ?
    `).run(
      c.title,
      c.category,
      c.trainerId || null,
      c.dayOfWeek,
      c.time,
      c.duration || 60,
      c.room,
      c.maxCapacity || 20,
      c.intensity || 'Moderate',
      c.description || '',
      c.banner || '',
      id
    );

    if (c.enrolledMembers && Array.isArray(c.enrolledMembers)) {
      db.prepare('DELETE FROM class_enrollments WHERE classId = ?').run(id);
      const enroll = db.prepare('INSERT OR IGNORE INTO class_enrollments (classId, memberId) VALUES (?, ?)');
      for (const mId of c.enrolledMembers) {
        enroll.run(id, mId);
      }
    }
    return this.getClassById(id);
  },

  enrollMember(classId, memberId) {
    db.prepare('INSERT OR IGNORE INTO class_enrollments (classId, memberId) VALUES (?, ?)').run(classId, memberId);
    return this.getClassById(classId);
  },

  unenrollMember(classId, memberId) {
    db.prepare('DELETE FROM class_enrollments WHERE classId = ? AND memberId = ?').run(classId, memberId);
    return this.getClassById(classId);
  },

  deleteClass(id) {
    db.prepare('DELETE FROM classes WHERE id = ?').run(id);
    return { success: true, deletedId: id };
  },

  // Equipment
  getEquipment() {
    return db.prepare('SELECT * FROM equipment ORDER BY id ASC').all();
  },

  getEquipmentById(id) {
    return db.prepare('SELECT * FROM equipment WHERE id = ?').get(id);
  },

  createEquipment(e) {
    const id = e.id || ('eq-' + Date.now());
    const count = db.prepare('SELECT COUNT(*) as count FROM equipment').get().count;
    const code = e.code || `EQ-${401 + count}`;
    db.prepare(`
      INSERT INTO equipment (id, code, name, category, zone, brand, serialNo, purchaseDate, lastServiceDate, nextServiceDate, status, condition, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      code,
      e.name,
      e.category || 'Cardio',
      e.zone || 'Zone A',
      e.brand || '',
      e.serialNo || '',
      e.purchaseDate || new Date().toISOString().split('T')[0],
      e.lastServiceDate || new Date().toISOString().split('T')[0],
      e.nextServiceDate || new Date(Date.now() + 90*24*60*60*1000).toISOString().split('T')[0],
      e.status || 'Operational',
      e.condition || 'Good',
      e.notes || ''
    );
    return this.getEquipmentById(id);
  },

  updateEquipment(id, e) {
    db.prepare(`
      UPDATE equipment
      SET name = ?, category = ?, zone = ?, brand = ?, serialNo = ?, purchaseDate = ?,
          lastServiceDate = ?, nextServiceDate = ?, status = ?, condition = ?, notes = ?
      WHERE id = ?
    `).run(
      e.name,
      e.category,
      e.zone,
      e.brand || '',
      e.serialNo || '',
      e.purchaseDate || '',
      e.lastServiceDate || '',
      e.nextServiceDate || '',
      e.status || 'Operational',
      e.condition || 'Good',
      e.notes || '',
      id
    );
    return this.getEquipmentById(id);
  },

  deleteEquipment(id) {
    db.prepare('DELETE FROM equipment WHERE id = ?').run(id);
    return { success: true, deletedId: id };
  },

  // Activities
  getActivities(limit = 30) {
    return db.prepare('SELECT * FROM activities ORDER BY timestamp DESC LIMIT ?').all(limit);
  },

  logActivity(act) {
    const id = act.id || ('act-' + Date.now());
    const now = new Date();
    const formatted = act.timestamp || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    db.prepare(`
      INSERT INTO activities (id, timestamp, type, title, description, icon)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      id,
      formatted,
      act.type || 'system',
      act.title,
      act.description,
      act.icon || 'fa-bell'
    );
    // Keep max 50 activities
    db.exec(`
      DELETE FROM activities WHERE id NOT IN (
        SELECT id FROM activities ORDER BY timestamp DESC LIMIT 50
      );
    `);
    return { id, timestamp: formatted, ...act };
  },

  // Complete data bundle (matches frontend DB.load() structure)
  getAllData() {
    return {
      settings: this.getSettings(),
      members: this.getMembers(),
      trainers: this.getTrainers(),
      classes: this.getClasses(),
      equipment: this.getEquipment(),
      activities: this.getActivities()
    };
  },

  // Sync entire frontend state into SQLite atomically inside a transaction
  syncFromFrontend(data) {
    if (!data) return false;
    db.exec('BEGIN TRANSACTION;');
    try {
      if (data.settings) {
        this.updateSettings(data.settings);
      }
      if (Array.isArray(data.members)) {
        db.exec('DELETE FROM members;');
        const insMem = db.prepare(`
          INSERT INTO members (id, code, name, email, phone, gender, age, tier, status, startDate, expiryDate, trainerId, emergencyContact, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const m of data.members) {
          insMem.run(m.id, m.code, m.name, m.email||'', m.phone||'', m.gender||'Other', m.age||20, m.tier||'Standard', m.status||'Active', m.startDate||'', m.expiryDate||'', m.trainerId||null, m.emergencyContact||'', m.notes||'');
        }
      }
      if (Array.isArray(data.trainers)) {
        db.exec('DELETE FROM trainers;');
        const insTrn = db.prepare(`
          INSERT INTO trainers (id, code, name, email, phone, specialization, experienceYears, rating, maxClients, hourlyRate, bio)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const t of data.trainers) {
          insTrn.run(t.id, t.code, t.name, t.email||'', t.phone||'', t.specialization||'', t.experienceYears||1, t.rating||4.8, t.maxClients||15, t.hourlyRate||1000, t.bio||'');
        }
      }
      if (Array.isArray(data.classes)) {
        db.exec('DELETE FROM class_enrollments; DELETE FROM classes;');
        const insCls = db.prepare(`
          INSERT INTO classes (id, code, title, category, trainerId, dayOfWeek, time, duration, room, maxCapacity, intensity, description, banner)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const insEnr = db.prepare('INSERT OR IGNORE INTO class_enrollments (classId, memberId) VALUES (?, ?)');
        for (const c of data.classes) {
          insCls.run(c.id, c.code, c.title, c.category||'', c.trainerId||null, c.dayOfWeek||'', c.time||'', c.duration||60, c.room||'', c.maxCapacity||20, c.intensity||'', c.description||'', c.banner||'');
          if (Array.isArray(c.enrolledMembers)) {
            for (const mId of c.enrolledMembers) {
              insEnr.run(c.id, mId);
            }
          }
        }
      }
      if (Array.isArray(data.equipment)) {
        db.exec('DELETE FROM equipment;');
        const insEq = db.prepare(`
          INSERT INTO equipment (id, code, name, category, zone, brand, serialNo, purchaseDate, lastServiceDate, nextServiceDate, status, condition, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const e of data.equipment) {
          insEq.run(e.id, e.code, e.name, e.category||'', e.zone||'', e.brand||'', e.serialNo||'', e.purchaseDate||'', e.lastServiceDate||'', e.nextServiceDate||'', e.status||'Operational', e.condition||'Good', e.notes||'');
        }
      }
      if (Array.isArray(data.activities)) {
        db.exec('DELETE FROM activities;');
        const insAct = db.prepare(`
          INSERT INTO activities (id, timestamp, type, title, description, icon)
          VALUES (?, ?, ?, ?, ?, ?)
        `);
        for (const a of data.activities.slice(0, 50)) {
          insAct.run(a.id, a.timestamp, a.type||'system', a.title||'', a.description||'', a.icon||'fa-bell');
        }
      }
      db.exec('COMMIT;');
      return true;
    } catch (err) {
      db.exec('ROLLBACK;');
      throw err;
    }
  },

  // Reset database back to seed defaults
  resetDatabase() {
    seedDatabase(true);
    return this.getAllData();
  },

  // Raw SQL execution for academic presentation demo
  executeSQL(sqlQuery) {
    const trimmed = (sqlQuery || '').trim();
    if (!trimmed) throw new Error("Empty SQL query");
    
    // Check if it's a SELECT query
    if (trimmed.toUpperCase().startsWith('SELECT') || trimmed.toUpperCase().startsWith('PRAGMA')) {
      const rows = db.prepare(trimmed).all();
      return { type: 'select', rowCount: rows.length, rows };
    } else {
      // DDL or DML execution
      db.exec(trimmed);
      return { type: 'exec', message: 'Query executed successfully' };
    }
  },

  // Database metadata & table statistics for presentation inspector
  getStats() {
    const memberCount = db.prepare('SELECT COUNT(*) as count FROM members').get().count;
    const activeMembers = db.prepare("SELECT COUNT(*) as count FROM members WHERE status = 'Active'").get().count;
    const trainerCount = db.prepare('SELECT COUNT(*) as count FROM trainers').get().count;
    const classCount = db.prepare('SELECT COUNT(*) as count FROM classes').get().count;
    const equipmentCount = db.prepare('SELECT COUNT(*) as count FROM equipment').get().count;
    const operationalEquipment = db.prepare("SELECT COUNT(*) as count FROM equipment WHERE status = 'Operational'").get().count;
    const enrollmentsCount = db.prepare('SELECT COUNT(*) as count FROM class_enrollments').get().count;

    let dbFileSize = 0;
    try {
      const stats = fs.statSync(DB_PATH);
      dbFileSize = stats.size;
    } catch (e) {}

    return {
      databaseFile: 'fitpulse.db',
      databaseEngine: 'SQLite3 (Node.js Native DatabaseSync)',
      databasePath: DB_PATH,
      fileSizeBytes: dbFileSize,
      fileSizeKB: (dbFileSize / 1024).toFixed(2),
      tables: {
        members: memberCount,
        activeMembers,
        trainers: trainerCount,
        classes: classCount,
        class_enrollments: enrollmentsCount,
        equipment: equipmentCount,
        operationalEquipment,
        activities: db.prepare('SELECT COUNT(*) as count FROM activities').get().count
      }
    };
  }
};

module.exports = DatabaseService;
