/**
 * FitPulse Gym & Fitness Club Membership System
 * Backend REST API Server (Node.js + Express + SQLite3)
 */

const express = require('express');
const cors = require('cors');
const path = require('node:path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger for live presentation terminal demo
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[API] ${new Date().toLocaleTimeString()} ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Serve static frontend files from workspace root
app.use(express.static(__dirname));

/* ==========================================
   SYSTEM & HEALTH CHECK ENDPOINTS
   ========================================== */

app.get('/api/status', (req, res) => {
  try {
    const stats = db.getStats();
    res.json({
      status: 'online',
      message: 'FitPulse Backend REST API is running',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      ...stats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Return entire application state bundle (for sync with frontend state)
app.get('/api/data', (req, res) => {
  try {
    const data = db.getAllData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sync full state bundle from frontend into SQLite
app.post('/api/sync', (req, res) => {
  try {
    const data = req.body;
    if (!data || !data.members) {
      return res.status(400).json({ error: 'Invalid data format' });
    }
    db.syncFromFrontend(data);
    res.json({ success: true, message: 'SQLite database synced successfully', stats: db.getStats() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reset database to initial seed data
app.post('/api/reset', (req, res) => {
  try {
    const data = db.resetDatabase();
    res.json({ message: 'Database reset to default seed data successfully', data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Live SQL execution endpoint for academic presentation demo
app.post('/api/sql', (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'SQL query string is required' });
    }
    const result = db.executeSQL(query);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* ==========================================
   MEMBERS REST API
   ========================================== */

app.get('/api/members', (req, res) => {
  try {
    const members = db.getMembers();
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/members/:id', (req, res) => {
  try {
    const member = db.getMemberById(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/members', (req, res) => {
  try {
    const member = db.createMember(req.body);
    db.logActivity({
      type: 'member',
      title: 'New Member Registered',
      description: `${member.name} joined with ${member.tier} tier subscription.`,
      icon: 'fa-user-plus'
    });
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/members/:id', (req, res) => {
  try {
    const member = db.updateMember(req.params.id, req.body);
    db.logActivity({
      type: 'member',
      title: 'Member Profile Updated',
      description: `Record modified for ${member.name}.`,
      icon: 'fa-user-pen'
    });
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/members/:id/renew', (req, res) => {
  try {
    const { newExpiryDate } = req.body;
    const member = db.renewMember(req.params.id, newExpiryDate);
    db.logActivity({
      type: 'subscription',
      title: 'Membership Renewed',
      description: `Extended subscription for ${member.name} to ${newExpiryDate}.`,
      icon: 'fa-rotate'
    });
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/members/:id', (req, res) => {
  try {
    const member = db.getMemberById(req.params.id);
    const result = db.deleteMember(req.params.id);
    if (member) {
      db.logActivity({
        type: 'member',
        title: 'Member Removed',
        description: `${member.name} was removed from club database.`,
        icon: 'fa-user-xmark'
      });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ==========================================
   TRAINERS REST API
   ========================================== */

app.get('/api/trainers', (req, res) => {
  try {
    res.json(db.getTrainers());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/trainers/:id', (req, res) => {
  try {
    const trainer = db.getTrainerById(req.params.id);
    if (!trainer) return res.status(404).json({ error: 'Trainer not found' });
    res.json(trainer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/trainers', (req, res) => {
  try {
    const trainer = db.createTrainer(req.body);
    db.logActivity({
      type: 'trainer',
      title: 'Trainer Hired',
      description: `Coach ${trainer.name} joined as certified fitness trainer.`,
      icon: 'fa-user-ninja'
    });
    res.status(201).json(trainer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/trainers/:id', (req, res) => {
  try {
    const trainer = db.updateTrainer(req.params.id, req.body);
    db.logActivity({
      type: 'trainer',
      title: 'Trainer Profile Updated',
      description: `Updated profile for coach ${trainer.name}.`,
      icon: 'fa-user-ninja'
    });
    res.json(trainer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/trainers/:id', (req, res) => {
  try {
    const trainer = db.getTrainerById(req.params.id);
    const result = db.deleteTrainer(req.params.id);
    if (trainer) {
      db.logActivity({
        type: 'trainer',
        title: 'Trainer Removed',
        description: `Coach ${trainer.name} removed from active roster.`,
        icon: 'fa-user-slash'
      });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ==========================================
   CLASSES REST API
   ========================================== */

app.get('/api/classes', (req, res) => {
  try {
    res.json(db.getClasses());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/classes/:id', (req, res) => {
  try {
    const cls = db.getClassById(req.params.id);
    if (!cls) return res.status(404).json({ error: 'Class not found' });
    res.json(cls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/classes', (req, res) => {
  try {
    const cls = db.createClass(req.body);
    db.logActivity({
      type: 'class',
      title: 'New Class Created',
      description: `${cls.title} added to the gym schedule.`,
      icon: 'fa-calendar-plus'
    });
    res.status(201).json(cls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/classes/:id', (req, res) => {
  try {
    const cls = db.updateClass(req.params.id, req.body);
    db.logActivity({
      type: 'class',
      title: 'Class Updated',
      description: `Schedule details updated for ${cls.title}.`,
      icon: 'fa-calendar-check'
    });
    res.json(cls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/classes/:id/enroll', (req, res) => {
  try {
    const { memberId } = req.body;
    const cls = db.enrollMember(req.params.id, memberId);
    const member = db.getMemberById(memberId);
    db.logActivity({
      type: 'class',
      title: 'Class Enrollment',
      description: `${member ? member.name : 'Member'} enrolled in ${cls.title}.`,
      icon: 'fa-calendar-check'
    });
    res.json(cls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/classes/:id/unenroll', (req, res) => {
  try {
    const { memberId } = req.body;
    const cls = db.unenrollMember(req.params.id, memberId);
    const member = db.getMemberById(memberId);
    db.logActivity({
      type: 'class',
      title: 'Class Drop',
      description: `${member ? member.name : 'Member'} unenrolled from ${cls.title}.`,
      icon: 'fa-calendar-xmark'
    });
    res.json(cls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/classes/:id', (req, res) => {
  try {
    const cls = db.getClassById(req.params.id);
    const result = db.deleteClass(req.params.id);
    if (cls) {
      db.logActivity({
        type: 'class',
        title: 'Class Cancelled',
        description: `${cls.title} was cancelled and removed.`,
        icon: 'fa-calendar-xmark'
      });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ==========================================
   EQUIPMENT REST API
   ========================================== */

app.get('/api/equipment', (req, res) => {
  try {
    res.json(db.getEquipment());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/equipment/:id', (req, res) => {
  try {
    const item = db.getEquipmentById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Equipment not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/equipment', (req, res) => {
  try {
    const item = db.createEquipment(req.body);
    db.logActivity({
      type: 'equipment',
      title: 'Equipment Registered',
      description: `${item.name} logged into facility inventory.`,
      icon: 'fa-wrench'
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/equipment/:id', (req, res) => {
  try {
    const item = db.updateEquipment(req.params.id, req.body);
    db.logActivity({
      type: 'equipment',
      title: 'Equipment Status Updated',
      description: `${item.name} status updated to ${item.status}.`,
      icon: 'fa-wrench'
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/equipment/:id', (req, res) => {
  try {
    const item = db.getEquipmentById(req.params.id);
    const result = db.deleteEquipment(req.params.id);
    if (item) {
      db.logActivity({
        type: 'equipment',
        title: 'Equipment Decommissioned',
        description: `${item.name} removed from inventory.`,
        icon: 'fa-trash-can'
      });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ==========================================
   ACTIVITIES REST API
   ========================================== */

app.get('/api/activities', (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 30;
    res.json(db.getActivities(limit));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/activities', (req, res) => {
  try {
    const act = db.logActivity(req.body);
    res.status(201).json(act);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ==========================================
   SETTINGS REST API
   ========================================== */

app.get('/api/settings', (req, res) => {
  try {
    res.json(db.getSettings());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/settings', (req, res) => {
  try {
    const settings = db.updateSettings(req.body);
    db.logActivity({
      type: 'system',
      title: 'Settings Updated',
      description: `Club details & operational preferences saved.`,
      icon: 'fa-gear'
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Express Server
const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🏋️ FITPULSE GYM MANAGEMENT BACKEND SERVER RUNNING`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🗄️ Database: SQLite3 (fitpulse.db)`);
  console.log(`⚡ Endpoints:`);
  console.log(`   - GET  /api/status     (System & DB Stats)`);
  console.log(`   - GET  /api/data       (Full Data Bundle)`);
  console.log(`   - GET  /api/members    (Member CRUD)`);
  console.log(`   - GET  /api/trainers   (Trainer CRUD)`);
  console.log(`   - GET  /api/classes    (Class CRUD & Enrollment)`);
  console.log(`   - GET  /api/equipment  (Equipment Records)`);
  console.log(`   - POST /api/sql        (Live SQL Demo Runner)`);
  console.log(`=======================================================`);
});

module.exports = { app, server };
