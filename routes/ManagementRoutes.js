// routes/ManagementRoutes.js
const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const User = require("../models/User");
const Token = require("../models/Token");
const sendEmail = require("../utils/SendEmail");

// Controller logic for getting all users
router.get("/getallmanagers", async (req, res) => {
  try {
    const users = await User.find({ role: "manager" });
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route to get a specific user by ID //WORKS
router.get("/get/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
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
    const userState = "inactive"; // Set the userState to "inactive"
    const verified = false;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email address already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user if email is unique + role + userState
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
      userState,
      verified, 
    });
    await user.save();

    // Create token for verification
    const token = await new Token({
			userId: user._id,
			token: crypto.randomBytes(32).toString("hex"),
		}).save();                  

		const url = `http://localhost:3000/users/${user._id}/verify/${token.token}`;
		await sendEmail(user.email, "Verify Email", url);
    
    res.status(201).send({ user, 
      message: "An email has been sent to your account, please verify to log in !!!" });
  } catch (err) {
    console.error("Error registering user (manager):", err);
    res.status(500).send("Internal Server Error");
  }
});

// Route to update a user by ID //WORKS
// router.patch("/patch/:id", async (req, res) => {
//   try {
//     // Find the user by ID
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).send("User not found");
//     }

//     // Update user fields with the ones provided in the request body
//     Object.assign(user, req.body);

//     // Save the updated user
//     await user.save();

//     // Respond with the updated user
//     res.send(user);
//   } catch (err) {
//     console.error("Error updating user:", err);
//     res.status(500).send("Internal server error");
//   }
// });

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

// Route to delete a manager by ID //WORKS
router.delete("/delete/:id", async (req, res) => {
  try {
    const manager = await User.findByIdAndDelete(req.params.id);
    if (!manager) {
      return res.status(404).send("Manager not found");
    }
    res.send(manager);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Define more routes as needed

module.exports = router;
