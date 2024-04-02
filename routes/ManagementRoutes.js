// routes/ManagementRoutes.js
const express = require("express");
const router = express.Router();
const Manager = require("../models/Management");

// Controller logic for getting all users
router.get("/getallmanagers", async (req, res) => {
  //DOES NOT WORK YET
  try {
    const users = await User.find({ role: "manager" });
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Controller logic for creating an olduser //WORKS
router.post("/registermanager", async (req, res) => {
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
    const role = "manager"; // Set the role field to "manager"

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
    console.error("Error registering user(manager):", err);
    res.status(500).send("Internal Server Error");
  }
});

// Define more routes as needed

module.exports = router;
