// routes/OldUserRoutes.js
const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const User = require("../models/User");
const Token = require("../models/Token");
const sendEmail = require("../utils/SendEmail");

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
      // medpapers,
      // country,
      city,
      password,
    } = req.body;
    const country = "Cyprus"; // Set the country field to "Cyprus"
    const role = "olduser"; // Set the role field to "olduser"
    const userState = "active"; // Set the userState to "active"
    const verified = false;
    const resetPasswordToken = "";
    
    const resetPasswordExpires = "";

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
      resetPasswordToken,
      resetPasswordExpires
    });
    await user.save();

    // Create token for verification
    const token = await new Token({
			userId: user._id,
			token: crypto.randomBytes(32).toString("hex"),
		}).save();                  

		const url = `http://localhost:3000/users/${user._id}/verify/${token.token}`;
		const text = `Congragulations, and welcome to the Friendship At All Ages team,\n\n
    only one step remains to activate your account, click the link below to verify your account:
    ${url} \n\n\n`
		await sendEmail(user.email, "Verify Email", text);
    
    res.status(201).send({ user, 
      message: "An email has been sent to your account, please verify to log in !!!" });
  } catch (err) {
    console.error("Error registering user (olduser):", err);
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

router.get("/olduser-stats", async (req, res) => {
  try {
    const pipeline = [
      // { $match: { role: "olduser", userState: "active" } },
      { $match: { role: "olduser" } }, // Filter to only include oldusers
      {
        $group: {
          _id: { city: "$city", gender: "$gender" }, // Group by city and gender
          count: { $sum: 1 } // Count the number of oldusers in each group
        }
      },
      {
        $group: {
          _id: "$_id.city", // Further group by city to structure the data by city
          genders: {
            $push: {
              gender: "$_id.gender",
              count: "$count"
            }
          },
          total: { $sum: "$count" } // Sum up all counts per city to get the total per city
        }
      },
      {
        $sort: { "_id": 1 } // Sort by city alphabetically
      }
    ];

    const oldUserStats = await User.aggregate(pipeline);
    res.send(oldUserStats);
  } catch (err) {
    console.error("Error fetching olduser stats:", err);
    res.status(500).send("Internal server error");
  }
});

// Define more routes as needed

module.exports = router;
