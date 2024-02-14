// models/Volunteer.js
const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  name: String,
  // email: String,
  // password: String,
  // Volunteer-specific properties
});

module.exports = mongoose.model('Volunteer', volunteerSchema);