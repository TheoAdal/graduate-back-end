// routes/AdminRoutes.js
const express = require("express");
const router = express.Router();
const Volunteer = require("../models/Admin");

const adminSchema = new mongoose.Schema({
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
    // phone: {
    //   type: String,
    //   required: true
    // },
    // country: {
    //   type: String,
    //   required: true
    // },
    // city: {
    //   type: String,
    //   required: true
    // }
    // password: String,
    // Volunteer-specific properties
  });
  
  module.exports = mongoose.model('Admin', adminSchema);