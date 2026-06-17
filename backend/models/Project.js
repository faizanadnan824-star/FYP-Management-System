const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  week:        { type: Number,  required: true },
  description: { type: String,  required: true },
  feedback:    { type: String,  default: '' },
  submittedAt: { type: Date,    default: Date.now },
});

const projectSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  domain:       { type: String, required: true },
  description:  { type: String, required: true },
  technologies: { type: String, required: true },
  teamMembers:  { type: String, default: '' },
  studentId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  status:       { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  feedback:     { type: String, default: '' },
  progress:     [progressSchema],
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);