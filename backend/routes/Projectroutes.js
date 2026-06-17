const express = require('express');
const router  = express.Router();
const Project = require('../models/Project');
const User    = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// ═══════════════════════════════════════════
// STUDENT ROUTES
// ═══════════════════════════════════════════

// POST /api/projects/submit — Student submits proposal
router.post('/submit', protect, async (req, res) => {
  try {
    if (req.user.role !== 'student')
      return res.status(403).json({ message: 'Only students can submit proposals' });

    const { title, domain, description, technologies, teamMembers } = req.body;
    if (!title || !domain || !description || !technologies)
      return res.status(400).json({ message: 'Title, domain, description and technologies are required' });

    const existing = await Project.findOne({ studentId: req.user._id });
    if (existing)
      return res.status(400).json({ message: 'You already submitted a proposal. Edit it instead.' });

    const student = await User.findById(req.user._id);

    const project = await Project.create({
      title, domain, description, technologies,
      teamMembers: teamMembers || '',
      studentId:    req.user._id,
      supervisorId: student.supervisorId || null,
    });

    res.status(201).json({ message: 'Proposal submitted successfully!', project });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/projects/my — Student gets own project
router.get('/my', protect, async (req, res) => {
  try {
    const project = await Project.findOne({ studentId: req.user._id })
      .populate('supervisorId', 'name email designation');
    res.json(project || null);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/projects/my — Student edits proposal (only if not approved)
router.put('/my', protect, async (req, res) => {
  try {
    const project = await Project.findOne({ studentId: req.user._id });
    if (!project) return res.status(404).json({ message: 'No project found' });
    if (project.status === 'approved')
      return res.status(400).json({ message: 'Approved projects cannot be edited' });

    const { title, domain, description, technologies, teamMembers } = req.body;
    Object.assign(project, { title, domain, description, technologies, teamMembers });
    project.status = 'pending';
    await project.save();
    res.json({ message: 'Proposal updated!', project });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/projects/progress — Student submits weekly progress
router.post('/progress', protect, async (req, res) => {
  try {
    const { week, description } = req.body;
    if (!week || !description)
      return res.status(400).json({ message: 'Week and description required' });

    const project = await Project.findOne({ studentId: req.user._id });
    if (!project) return res.status(404).json({ message: 'No project found. Submit a proposal first.' });
    if (project.status !== 'approved')
      return res.status(400).json({ message: 'Your project must be approved before submitting progress.' });

    const weekExists = project.progress.find(p => p.week === +week);
    if (weekExists)
      return res.status(400).json({ message: `Week ${week} progress already submitted.` });

    project.progress.push({ week: +week, description });
    await project.save();
    res.json({ message: 'Progress submitted!', project });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ═══════════════════════════════════════════
// SUPERVISOR ROUTES
// ═══════════════════════════════════════════

// GET /api/projects/assigned — Supervisor sees their projects
router.get('/assigned', protect, async (req, res) => {
  try {
    if (req.user.role !== 'supervisor')
      return res.status(403).json({ message: 'Supervisor only' });

    const projects = await Project.find({ supervisorId: req.user._id })
      .populate('studentId', 'name email rollNo department semester batch');
    res.json(projects);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/projects/:id/review — Supervisor approves or rejects
router.put('/:id/review', protect, async (req, res) => {
  try {
    if (req.user.role !== 'supervisor')
      return res.status(403).json({ message: 'Supervisor only' });

    const { status, feedback } = req.body;
    if (!['approved','rejected'].includes(status))
      return res.status(400).json({ message: 'Status must be approved or rejected' });

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, supervisorId: req.user._id },
      { status, feedback: feedback || '' },
      { new: true }
    ).populate('studentId', 'name email rollNo');

    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: `Project ${status}!`, project });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/projects/:id/progress-feedback — Supervisor gives feedback on progress
router.put('/:id/progress-feedback', protect, async (req, res) => {
  try {
    if (req.user.role !== 'supervisor')
      return res.status(403).json({ message: 'Supervisor only' });

    const { progressId, feedback } = req.body;
    const project = await Project.findOne({ _id: req.params.id, supervisorId: req.user._id });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const prog = project.progress.id(progressId);
    if (!prog) return res.status(404).json({ message: 'Progress entry not found' });

    prog.feedback = feedback;
    await project.save();
    res.json({ message: 'Feedback added!', project });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ═══════════════════════════════════════════
// ADMIN ROUTES
// ═══════════════════════════════════════════

// GET /api/projects/all — Admin sees all projects
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('studentId',    'name email rollNo department')
      .populate('supervisorId', 'name email')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/projects/:id/assign-supervisor — Admin assigns supervisor to project
router.put('/:id/assign-supervisor', protect, adminOnly, async (req, res) => {
  try {
    const { supervisorId } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { supervisorId: supervisorId || null },
      { new: true }
    ).populate('studentId','name email').populate('supervisorId','name email');
    res.json({ message: 'Supervisor assigned to project!', project });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/projects/:id — Admin deletes project
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;