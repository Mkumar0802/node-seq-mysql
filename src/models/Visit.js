// models/Visit.js
const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  visitorId: { type: String, required: true },
  page: { type: String, required: true },
  userAgent: String,
  ip: String,
  firstSeen: { type: Date, default: Date.now },
}, { timestamps: true });

visitSchema.index({ page: 1, visitorId: 1 }, { unique: true });

const visitorSchema = new mongoose.Schema({
  visitorId: { type: String, required: true, unique: true },
  firstSeen: { type: Date, default: Date.now },
  lastSeen: Date,
});

const Visit = mongoose.model('Visit', visitSchema);
const Visitor = mongoose.model('Visitor', visitorSchema);

module.exports = { Visit, Visitor };
