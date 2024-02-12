// routes/VolunteerRoutes.js
const express = require("express");
const router = express.Router();
const Volunteer = require("../models/Volunteer");

// Controller logic for creating a volunteer
router.post("/", async (req, res) => {
  try {
    const volunteer = new Volunteer(req.body);
    await volunteer.save();
    res.status(201).send(volunteer);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Controller logic for getting all volunteers
router.get("/", async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.send(volunteers);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route to update a volunteer user by ID
router.patch("/volunteers/:id", async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!volunteer) {
      return res.status(404).send("Volunteer not found");
    }
    res.send(volunteer);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Route to delete a volunteer user by ID
router.delete("/volunteers/:id", async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
    if (!volunteer) {
      return res.status(404).send("Volunteer not found");
    }
    res.send(volunteer);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route to get a specific volunteer user by ID
router.get("/volunteers/:id", async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) {
      return res.status(404).send("Volunteer not found");
    }
    res.send(volunteer);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Define more routes as needed

module.exports = router;
