// models/AppointmentRequest.js
const mongoose = require("mongoose");

const appointmentRequestSchema = new mongoose.Schema({
  oldUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  preferredAge: {
    type: String, // Changed from Number to String to accommodate age ranges
    enum: ['16-20', '21-30', '31-40', '41-50', '51++'], // Define acceptable age ranges
    required: false
  },
  preferredCity: String,
  preferredGender: String,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending',
  },
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  requestDate: {
    type: String,
    default: Date.now,
  },
  appointmentDate: String,
  appointmentTime: String,
  description: String,
});

const AppointmentRequest = mongoose.model("AppointmentRequest", appointmentRequestSchema);
module.exports = AppointmentRequest;
