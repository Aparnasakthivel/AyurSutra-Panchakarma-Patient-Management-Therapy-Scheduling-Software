const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  patientId: { type: String, required: true }, // Changed from ObjectId to String to match Patient IDs like "P0003"
  patientName: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  appointmentDate: { type: Date, required: true },
  scheduledFor: { type: Date, required: true },
  type: { type: String, enum: ['immediate','day-before'], required: true },
  sent: { type: Boolean, default: false },
  sentAt: { type: Date },
  result: { type: mongoose.Schema.Types.Mixed }, // Store notification results
  error: { type: String }, // Store any dispatch errors
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reminder', reminderSchema);
