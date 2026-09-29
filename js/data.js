/**
 * FitPulse Gym & Fitness Club Membership System
 * Data Layer & LocalStorage Database
 */

const STORAGE_KEY = 'FITPULSE_GYM_DATA_V1';

// Initial Seed Data
const DEFAULT_DATA = {
  settings: {
    gymName: "FitPulse Elite Athletic Club",
    address: "442 Ironcore Blvd, Metro Fitness Center",
    phone: "+1 (555) 789-2040",
    email: "admin@fitpulse-club.com",
    currency: "$",
    taxRate: 8,
    operatingHours: "05:00 AM - 11:00 PM (Daily)"
  },
  members: [
    {
      id: "mem-1",
      code: "FP-1001",
      name: "Alexander Wright",
      email: "alex.wright@example.com",
      phone: "+1 (555) 234-8901",
      gender: "Male",
      age: 28,
      tier: "VIP Black",
      status: "Active",
      startDate: "2026-01-15",
      expiryDate: "2027-01-15",
      trainerId: "trn-1",
      emergencyContact: "Sarah Wright (+1 555-234-8909)",
      notes: "Focus on hypertrophy & athletic conditioning. Previous shoulder strain.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
    },
    {
      id: "mem-2",
      code: "FP-1002",
      name: "Sophia Martinez",
      email: "sophia.m@example.com",
      phone: "+1 (555) 345-6712",
      gender: "Female",
      age: 25,
      tier: "Premium",
      status: "Active",
      startDate: "2026-03-01",
      expiryDate: "2026-09-01",
      trainerId: "trn-2",
      emergencyContact: "Carlos Martinez (+1 555-345-9988)",
      notes: "Marathon prep and mobility endurance training.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80"
    },
    {
      id: "mem-3",
      code: "FP-1003",
      name: "Marcus Vance",
      email: "marcus.v@example.com",
      phone: "+1 (555) 456-1123",
      gender: "Male",
      age: 34,
      tier: "Standard",
      status: "Expiring Soon",
      startDate: "2025-10-10",
      expiryDate: "2026-10-10",
      trainerId: "trn-3",
      emergencyContact: "Elena Vance (+1 555-456-7788)",
      notes: "Powerlifting fundamentals: Squat, Bench, Deadlift.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80"
    },
    {
      id: "mem-4",
      code: "FP-1004",
      name: "Olivia Chen",
      email: "olivia.chen@example.com",
      phone: "+1 (555) 567-8890",
      gender: "Female",
      age: 31,
      tier: "VIP Black",
      status: "Active",
      startDate: "2026-02-10",
      expiryDate: "2027-02-10",
      trainerId: "trn-2",
      emergencyContact: "David Chen (+1 555-567-4433)",
      notes: "Rehabilitation and postural alignment after desk work fatigue.",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80"
    },
    {
      id: "mem-5",
      code: "FP-1005",
      name: "Derrick Jackson",
      email: "d.jackson@example.com",
      phone: "+1 (555) 678-9012",
      gender: "Male",
      age: 42,
      tier: "Basic",
      status: "Expired",
      startDate: "2025-08-01",
      expiryDate: "2026-08-01",
      trainerId: "",
      emergencyContact: "Grace Jackson (+1 555-678-2211)",
      notes: "General cardio wellness & cardiovascular recovery.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80"
    },
    {
      id: "mem-6",
      code: "FP-1006",
      name: "Emily Watson",
      email: "emily.watson@example.com",
      phone: "+1 (555) 789-3344",
      gender: "Female",
      age: 23,
      tier: "Premium",
      status: "Active",
      startDate: "2026-04-12",
      expiryDate: "2026-10-12",
      trainerId: "trn-4",
      emergencyContact: "Robert Watson (+1 555-789-5566)",
      notes: "High intensity interval training and functional agility.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80"
    }
  ],
  trainers: [
    {
      id: "trn-1",
      code: "TR-201",
      name: "Viktor 'Titan' Ramos",
      email: "viktor.ramos@fitpulse.com",
      phone: "+1 (555) 901-2233",
      specialization: "Strength & Bodybuilding",
      experienceYears: 9,
      rating: 4.9,
      maxClients: 15,
      hourlyRate: 65,
      bio: "Former powerlifting champion specializing in raw strength progression and hypertrophy periodization.",
      avatar: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=250&q=80"
    },
    {
      id: "trn-2",
      code: "TR-202",
      name: "Maya Lin",
      email: "maya.lin@fitpulse.com",
      phone: "+1 (555) 902-3344",
      specialization: "Yoga & Functional Mobility",
      experienceYears: 7,
      rating: 4.95,
      maxClients: 20,
      hourlyRate: 60,
      bio: "Certified Ashtanga master with extensive credentials in injury prevention, flexibility, and core alignment.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80"
    },
    {
      id: "trn-3",
      code: "TR-203",
      name: "Cole Henderson",
      email: "cole.h@fitpulse.com",
      phone: "+1 (555) 903-4455",
      specialization: "CrossFit & Olympic Lifting",
      experienceYears: 6,
      rating: 4.8,
      maxClients: 12,
      hourlyRate: 70,
      bio: "Level 3 CrossFit coach focused on explosive athletic power, clean & jerk mechanics, and metabolic conditioning.",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80"
    },
    {
      id: "trn-4",
      code: "TR-204",
      name: "Zara Sterling",
      email: "zara.s@fitpulse.com",
      phone: "+1 (555) 904-5566",
      specialization: "HIIT & Cardio Conditioning",
      experienceYears: 5,
      rating: 4.85,
      maxClients: 18,
      hourlyRate: 55,
      bio: "High-octane spin instructor and fat loss specialist delivering science-backed heart rate interval protocols.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80"
    }
  ],
  classes: [
    {
      id: "cls-1",
      code: "CLS-301",
      title: "Dawn Shred: HIIT Blitz",
      category: "HIIT",
      trainerId: "trn-4",
      dayOfWeek: "Monday, Wednesday, Friday",
      time: "06:30 AM - 07:30 AM",
      duration: 60,
      room: "Studio Alpha (Floor 2)",
      maxCapacity: 16,
      intensity: "High",
      enrolledMembers: ["mem-2", "mem-6"],
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
      description: "Deep dive into barbell biomechanics, barbell squatting, bench press arches, and deadlift form.",
      banner: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "cls-3",
      code: "CLS-303",
      title: "Zenith Vinyasa Flow",
      category: "Yoga",
      trainerId: "trn-2",
      dayOfWeek: "Monday, Thursday, Saturday",
      time: "08:00 AM - 09:00 AM",
      duration: 60,
      room: "Zen Studio (Floor 3)",
      maxCapacity: 20,
      intensity: "Moderate",
      enrolledMembers: ["mem-2", "mem-4"],
      description: "Harmonizing breath and movement to release spinal tension, open hip flexors, and build deep core stamina.",
      banner: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "cls-4",
      code: "CLS-304",
      title: "Velocity Spin & RPM Ride",
      category: "Cardio",
      trainerId: "trn-4",
      dayOfWeek: "Wednesday, Friday",
      time: "06:00 PM - 07:00 PM",
      duration: 60,
      room: "Cycle Arena (Floor 1)",
      maxCapacity: 18,
      intensity: "High",
      enrolledMembers: ["mem-1", "mem-6"],
      description: "Rhythm-based immersive cycling with club lighting, heavy hill climbs, and sprint finishes.",
      banner: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "cls-5",
      code: "CLS-305",
      title: "WOD Beast CrossFit",
      category: "CrossFit",
      trainerId: "trn-3",
      dayOfWeek: "Saturday, Sunday",
      time: "10:00 AM - 11:30 AM",
      duration: 90,
      room: "CrossFit Box (Zone C)",
      maxCapacity: 12,
      intensity: "Extreme",
      enrolledMembers: ["mem-3"],
      description: "Team and solo workouts of the day with kettlebell snatches, wall balls, box jumps, and burpees.",
      banner: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80"
    }
  ],
  equipment: [
    {
      id: "eq-1",
      code: "EQ-401",
      name: "Matrix Ultra Olympic Power Rack #1",
      category: "Free Weights",
      zone: "Zone A - Free Weights",
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
      zone: "Floor 2 - Functional Arena",
      brand: "Concept2",
      serialNo: "C2-RW-44120",
      purchaseDate: "2025-01-18",
      lastServiceDate: "2026-09-02",
      nextServiceDate: "2026-12-02",
      status: "Operational",
      condition: "Pristine",
      notes: "Chain oiled and PM5 monitor firmware updated."
    },
    {
      id: "eq-4",
      code: "EQ-404",
      name: "Hammer Strength Plate-Loaded Leg Press",
      category: "Resistance",
      zone: "Zone B - Resistance Deck",
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
      name: "Eleiko Olympic Competition Barbell Set",
      category: "Free Weights",
      zone: "Barbell Pit (Zone A)",
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
      zone: "Cycle Arena (Floor 1)",
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
      name: "Cable Crossover Jungle Gym 8-Stack",
      category: "Resistance",
      zone: "Zone B - Resistance Deck",
      brand: "Precor Commercial",
      serialNo: "PR-JG-33012",
      purchaseDate: "2024-01-20",
      lastServiceDate: "2026-09-01",
      nextServiceDate: "2026-12-01",
      status: "Operational",
      condition: "Good",
      notes: "All cables replaced in Q2. Pulleys lubricated."
    }
  ],
  activities: [
    {
      id: "act-1",
      timestamp: "2026-09-29 18:40",
      type: "member",
      title: "New Member Registered",
      description: "Alexander Wright registered under VIP Black tier.",
      icon: "fa-user-plus"
    },
    {
      id: "act-2",
      timestamp: "2026-09-29 17:15",
      type: "class",
      title: "Class Enrollment",
      description: "Emily Watson enrolled in Dawn Shred: HIIT Blitz.",
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
      description: "Maya Lin assigned to Sophia Martinez.",
      icon: "fa-dumbbell"
    },
    {
      id: "act-5",
      timestamp: "2026-09-29 11:20",
      type: "subscription",
      title: "Renewal Notification",
      description: "Marcus Vance subscription status flagged: Expiring Soon.",
      icon: "fa-clock"
    }
  ]
};

// Database Access Object (DAO)
const DB = {
  load() {
    try {
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
