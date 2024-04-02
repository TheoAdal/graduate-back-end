// routes/OldUserRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Controller logic for getting all users //WORKS
router.get("/getalloldusers", async (req, res) => {
  try {
    const users = await User.find({ role: "olduser" });
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});
// Controller logic for getting all active oldusers //WORKS
router.get("/getallactiveold", async (req, res) => {
  try {
    const users = await User.find({ role: "olduser", userState: "active" });
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});
// Controller logic for getting all inactive oldusers //WORKS
router.get("/getallinactiveold", async (req, res) => {
  try {
    const users = await User.find({ role: "olduser", userState: "inactive" });
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Controller logic for creating an olduser //WORKS
router.post("/registerolduser", async (req, res) => {
  try {
    const {
      name,
      surname,
      email,
      mobile,
      gender,
      dateofbirth,
      nid,
      medpapers,
      country,
      city,
      password,
    } = req.body;
    const role = "olduser"; // Set the role field to "olduser"

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
      medpapers,
      country,
      city,
      password: hashedPassword,
      role,
    });
    await user.save();

    res.status(201).send(user);
  } catch (err) {
    console.error("Error registering user(olduser):", err);
    res.status(500).send("Internal Server Error");
  }
});

// Define more routes as needed

module.exports = router;
