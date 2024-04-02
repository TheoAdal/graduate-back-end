// models/Visits.js
const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  volname: {
    type: String,
    required: true,
  },
  volsurname: {
    type: String,
    required: true,
  },
  vol_id: {
    type: String,
    required: true,
  },
  oldname: {
    type: String,
    required: true,
  },
  oldsurname: {
    type: String,
    required: true,
  },
  old_id: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const Visits = mongoose.model("Visits", visitSchema);


module.exports = Visits;
