// routes/AdminRoutes.js
const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");

// Controller logic for getting all admins //WORKS
router.get("/getall", async (req, res) => {
  try {
    const admins = await Admin.find();
    res.send(admins);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route to get a specific admin user by ID //WORKS
router.get("/get/:id", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).send("Admin not found");
    }
    res.send(admin);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, surname, email, mobile, password } = req.body;

    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).send("Email address already exists");
    }

    // Create new admin if email is unique
    const admin = new Volunteer({ name, surname, email, mobile, password });
    await admin.save();
    
    res.status(201).send(admin);
  } catch (err) {
    console.error("Error registering admin:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Route to update a admin user by ID //WORKS
router.patch("/patch/:id", async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!admin) {
      return res.status(404).send("Admin not found");
    }
    res.send(admin);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Route to delete a admin user by ID //WORKS
router.delete("/delete/:id", async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).send("Admin not found");
    }
    res.send(admin);
  } catch (err) {
    res.status(500).send(err);
  }
});
  

// Define more routes as needed

module.exports = router;