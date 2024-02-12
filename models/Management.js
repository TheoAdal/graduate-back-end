// models/Management.js
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  // Admin-specific properties
});

module.exports = mongoose.model('Management', managementSchema);