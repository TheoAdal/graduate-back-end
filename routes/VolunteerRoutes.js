// routes/VolunteerRoutes.js
const express = require("express");
const router = express.Router();
const Volunteer = require("../models/Volunteer");

// Controller logic for getting all volunteers //WORKS
router.get("/getall", async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.send(volunteers);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route to get a specific volunteer user by ID //WORKS
router.get("/get/:id", async (req, res) => {
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

// Controller logic for creating a volunteer //WORKS
router.post("/register", async (req, res) => {
  try {
    const { name, surname, email, mobile, country, city, password  } = req.body;
    const role = "volunteer"; // Set the role field to "volunteer"

    // Check if email already exists
    const existingVolunteer = await Volunteer.findOne({ email });
    if (existingVolunteer) {
      return res.status(400).send("Email address already exists");
    }

    // Create new volunteer if email is unique + the role
    const volunteer = new Volunteer({ name, surname, email, mobile, country, city, password, role });
    await volunteer.save();
    
    res.status(201).send(volunteer);
  } catch (err) {
    console.error("Error registering volunteer:", err);
    res.status(500).send("Internal Server Error");
  }
});


// Route to update a volunteer user by ID //WORKS
router.patch("/patch/:id", async (req, res) => {
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

// Route to delete a volunteer user by ID //WORKS
router.delete("/delete/:id", async (req, res) => {
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

// Define more routes as needed

module.exports = router;
