// routes/AdminRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Controller logic for getting all admins //WORKS
router.get("/getall", async (req, res) => {
  try {
    const admins = await User.find();
    res.send(admins);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route to get a specific admin user by ID //WORKS
router.get("/get/:id", async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);
    if (!admin) {
      return res.status(404).send("Admin not found");
    }
    res.send(admin);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Controller logic for creating an admin //WORKS
router.post("/registeradmin", async (req, res) => {
  try {
    const {
      name,
      surname,
      email,
      mobile,
      gender,
      dateofbirth,
      nid,
      country,
      city,
      password,
    } = req.body;
    const role = "admin"; // Set the role field to "admin"

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email address already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user if email is unique + the role
    const user = new User({
      name,
      surname,
      email,
      mobile,
      gender,
      dateofbirth,
      nid,
      country,
      city,
      password: hashedPassword,
      role,
    });

    await user.save();

    res.status(201).send(user);
  } catch (err) {
    console.error("Error registering user(volunteer):", err);
    res.status(500).send("Internal Server Error");
  }
});

// Route to update a admin user by ID //WORKS
// router.patch("/patch/:id", async (req, res) => {
//   try {
//     const admin = await User.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     if (!admin) {
//       return res.status(404).send("Admin not found");
//     }
//     res.send(admin);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

// Route to delete an admin user by ID //WORKS
router.delete("/delete/:id", async (req, res) => {
  try {
    const admin = await User.findByIdAndDelete(req.params.id);
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