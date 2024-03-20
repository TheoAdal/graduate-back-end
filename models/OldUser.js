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
  mobile: {
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
  },
  password: {
    type: String,
    required: true
  },
});

const OldUser = mongoose.model('OldUser', oldUserSchema)

module.exports = OldUser;

// module.exports = mongoose.model('OldUser', oldUserSchema);