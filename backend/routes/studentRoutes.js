const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// GET all students — admin only
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .populate('supervisorId', 'name email')
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT assign supervisor to student — admin only
router.put('/:id/assign', protect, adminOnly, async (req, res) => {
  try {
    const { supervisorId } = req.body;
    const student = await User.findByIdAndUpdate(
      req.params.id,
      { supervisorId: supervisorId || null },
      { new: true }
    ).select('-password').populate('supervisorId', 'name email');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Supervisor assigned', student });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE student — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student removed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;