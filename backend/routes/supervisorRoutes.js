const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const bcrypt  = require('bcryptjs');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// GET all supervisors
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const list = await User.find({ role: 'supervisor' }).select('-password').sort({ createdAt: -1 });
    res.json(list);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create supervisor
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, email, password, phone, designation, department, specialization, maxStudents, bio, status, image } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password required' });
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already exists' });
    const hashed = await bcrypt.hash(password, 12);
    const sv = await User.create({
      name, email, password: hashed, role: 'supervisor',
      phone, designation, department, specialization,
      maxStudents: maxStudents || 5, bio, image,
      isActive: status === 'Active',
    });
    const { password: _, ...data } = sv.toObject();
    res.status(201).json({ message: 'Supervisor created', supervisor: data });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET single supervisor
router.get('/:id', protect, adminOnly, async (req, res) => {
  try {
    const sv = await User.findById(req.params.id).select('-password');
    if (!sv) return res.status(404).json({ message: 'Not found' });
    res.json(sv);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT update supervisor
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { name, email, phone, designation, department, specialization, maxStudents, bio, status, image } = req.body;
    const sv = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, designation, department, specialization, maxStudents, bio, image, isActive: status === 'Active' },
      { new: true }
    ).select('-password');
    if (!sv) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Updated', supervisor: sv });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE supervisor
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Supervisor removed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;