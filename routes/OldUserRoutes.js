// routes/OldUserRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
    const userState = "inactive"; // Set the userState to "inactive"

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email address already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user if email is unique + the role + userState
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
      userState,
    });
    await user.save();

    res.status(201).send(user);
  } catch (err) {
    console.error("Error registering user(olduser):", err);
    res.status(500).send("Internal Server Error");
  }
});

// Route to update an olduser by ID //WORKS
router.patch("/patch/:id", async (req, res) => {
  try {
    // Find the user by ID
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Update user fields with the ones provided in the request body
    Object.assign(user, req.body);

    // Save the updated user
    await user.save();

    // Respond with the updated user
    res.send(user);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).send("Internal server error");
  }
});

// Route to update the userState of an olduser by ID //WORKS
router.patch("/changeState/:id", async (req, res) => {
  try {
    // Find the user by ID
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    let userState = user.userState;

    //if userState empty, set to "active"
    if (!userState) {
      userState = "active";
    } else {
      //Update userState from inactive to active and vice versa
      user.userState = userState === "inactive" ? "active" : "inactive";
    }

    // Save the updated user
    await user.save();

    // Respond with the updated user
    res.send(user);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).send("Internal server error");
  }
});

// Route to delete an old user by ID //WORKS
router.delete("/delete/:id", async (req, res) => {
  try {
    // const user = await User.findById(req.params.id);
    // User.delete(req.params.id)
     const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send("olduser not found");
    }
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Define more routes as needed

module.exports = router;
