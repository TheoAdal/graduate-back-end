// routes/VolunteerRoutes.js
const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const User = require("../models/User");
const Token = require("../models/Token");
const sendEmail = require("../utils/SendEmail");

// Controller logic for getting all volunteers //WORKS
router.get("/getallvol", async (req, res) => {
  try {
    const users = await User.find({ role: "volunteer" });
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});
// Controller logic for getting all active volunteers //WORKS
router.get("/getallactivevol", async (req, res) => {
  try {
    const users = await User.find({ role: "volunteer", userState: "active" });
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});
// Controller logic for getting all inactive volunteers //WORKS
router.get("/getallinactivevol", async (req, res) => {
  try {
    const users = await User.find({ role: "volunteer", userState: "inactive" });
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

// Controller logic for creating a volunteer //WORKS
router.post("/registervolunteer", async (req, res) => {
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
    const role = "volunteer"; // Set the role field to "volunteer"
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
      verified, //
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
    console.error("Error registering user (volunteer):", err);
    res.status(500).send("Internal Server Error");
  }
});

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

// Route to delete a user by ID //WORKS
router.delete("/delete/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Link verification
// router.get("/:id/verify/:token", async (req, res) => {
//   if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
//     return res.status(400).send({ message: "Invalid ID format" });
// }
// if (!req.params.token.match(/^[0-9a-fA-F]{64}$/)) {
//     return res.status(400).send({ message: "Invalid token format" });
// }
//   try {
//       const user = await User.findOne({ _id: req.params.id });
//       if (!user) return res.status(400).send({ message: "Invalid user" });

//       const token = await Token.findOne({userId: user._id,token: req.params.token, });
//       if (!token) return res.status(400).send({ message: "Invalid token" });

//       await User.updateOne({ _id: user._id }, { verified: true });
      

//       res.status(200).send({ message: "Email verified successfully" });
//       await Token.deleteOne({ _id: token._id });
//   } catch (error) {
//       console.error(error);
//       res.status(500).send({ message: "Internal Server Error" });
//   }
// });

module.exports = router;

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