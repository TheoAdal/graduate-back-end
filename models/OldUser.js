// models/OldUser.js
const mongoose = require('mongoose');

const oldUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  }
  // password: String,
  // OldUser-specific properties
});

module.exports = mongoose.model('OldUser', oldUserSchema);