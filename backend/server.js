require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const connectDB = require('./config/db');
const User   = require('./models/User');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',        require('./routes/authRoutes'));
app.use('/api/supervisors', require('./routes/supervisorRoutes'));
app.use('/api/students',    require('./routes/studentRoutes'));
app.use('/api/projects',    require('./routes/Projectroutes'));   // ← NEW

// ── Old supervisor route (backward compat) ────────────────────────────────────
const oldSvRouter = require('express').Router();
const bcrypt2 = require('bcryptjs');

oldSvRouter.post('/add', async (req, res) => {
  try {
    const { name, email, password, phone, designation, bio } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered!' });
    const hashed = await bcrypt2.hash(password, 12);
    await User.create({ name, email, password: hashed, phone, designation, field: bio, role: 'supervisor' });
    res.status(201).json({ message: 'Supervisor saved!' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

oldSvRouter.get('/all', async (req, res) => {
  try {
    const supervisors = await User.find({ role: 'supervisor' });
    const formatted = supervisors.map(sv => ({
      id: sv._id, _id: sv._id,
      name: sv.name, email: sv.email,
      department: sv.department || 'N/A',
      status: sv.isActive ? 'Active' : 'Inactive',
      isActive: sv.isActive,
      specialization: sv.specialization || sv.field || 'N/A',
      maxProjects: sv.maxStudents || 0,
      maxStudents: sv.maxStudents || 0,
      phone: sv.phone, designation: sv.designation, bio: sv.bio,
    }));
    res.json(formatted);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

oldSvRouter.delete('/delete/:id', async (req, res) => {
  try { await User.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.use('/api/supervisor', oldSvRouter);

// ── Seed Admin ────────────────────────────────────────────────────────────────
const seedAdmin = async () => {
  const exists = await User.findOne({ role: 'admin' });
  if (!exists) {
    const hashed = await bcrypt.hash('admin123', 12);
    await User.create({ name: 'Admin', email: 'admin@fui.edu.pk', password: hashed, role: 'admin' });
    console.log('✅ Admin seeded: admin@fui.edu.pk / admin123');
  } else {
    console.log('✅ Admin exists');
  }
};

const startServer = async () => {
  try {
    console.log('⏳ Connecting to MongoDB...');
    await connectDB();
    await seedAdmin();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

startServer();