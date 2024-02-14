// models/OldUser.js
const mongoose = require('mongoose');

const oldUserSchema = new mongoose.Schema({
  name: String,
  // email: String,
  // password: String,
  // OldUser-specific properties
});

module.exports = mongoose.model('OldUser', oldUserSchema);