// models/Management.js
const mongoose = require('mongoose');

const managementSchema = new mongoose.Schema({
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
  // Management-specific properties
});

const Management = mongoose.model('Management', managementSchema);

module.exports = Management;



// module.exports = mongoose.model('Management', ManagementSchema);