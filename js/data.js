/**
 * FitPulse Gym & Fitness Club Membership System
 * Data Layer & LocalStorage Database
 */

const STORAGE_KEY = 'FITPULSE_GYM_DATA_V2';

// Initial Seed Data with Team Members & Indian Context
const DEFAULT_DATA = {
  settings: {
    gymName: "FitPulse Elite Athletic Club",
    address: "67 Anna Salai, Guindy Industrial Estate, Chennai, Tamil Nadu - 600032",
    phone: "+91 (044) 2235-8900",
    email: "support@fitpulse-chennai.in",
    currency: "₹",
    taxRate: 18,
    operatingHours: "05:30 AM - 10:30 PM (Daily)"
  },
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

// Database Access Object (DAO)
const DB = {
  load() {
    try {
      localStorage.removeItem('FITPULSE_GYM_DATA_V1');
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.save(DEFAULT_DATA);
        return JSON.parse(JSON.stringify(DEFAULT_DATA));
      }
      return JSON.parse(data);
    } catch (e) {
      console.error("Error reading localStorage:", e);
      return JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
  },

  save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  },

  reset() {
    localStorage.removeItem(STORAGE_KEY);
    this.save(DEFAULT_DATA);
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  },

  exportJSON() {
    return JSON.stringify(this.load(), null, 2);
  },

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.members && parsed.trainers && parsed.classes && parsed.equipment) {
        this.save(parsed);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  },

  logActivity(title, description, type = "system", icon = "fa-bell") {
    const data = this.load();
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newAct = {
      id: "act-" + Date.now(),
      timestamp: formattedDate,
      type,
      title,
      description,
      icon
    };
    data.activities.unshift(newAct);
    if (data.activities.length > 30) data.activities.pop();
    this.save(data);
  }
};
