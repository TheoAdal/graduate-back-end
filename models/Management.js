// models/Management.js
const mongoose = require('mongoose');

const ManagementSchema = new mongoose.Schema({
  name: String,
  // email: String,
  // password: String,
  // Management-specific properties
});

module.exports = mongoose.model('Management', ManagementSchema);