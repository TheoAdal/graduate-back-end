// routes/UserRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Visits = require("../models/Visits");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


router.patch("/patch/:id", async (req, res) => {
  try {
    // check if user changed his password
    if (req.body.password) {
      // hash the new password
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;

// Route to update a userState by ID //WORKS

// router.patch("/changeState/:id", async (req, res) => {
//   try {
//     // Find the user by ID
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).send("User not found");
//     }

//     let userState = user.userState;

//     //if userState empty, set to "active"
//     if (!userState) {
//       userState = "active";
//     } else {
//       //Update userState from inactive to active and vice versa
//       user.userState = userState === "inactive" ? "active" : "inactive";
//     }


//     // Save the updated user
//     await user.save();

//     // Respond with the updated user
//     res.send(user);
//   } catch (err) {
//     console.error("Error updating user:", err);
//     res.status(500).send("Internal server error");
//   }
// });

//filter volunteer for cities and states
// router.get("/filtervol/:city/:userState", async (req, res) => {
//   try {
//     const role = "volunteer";
//     let query = { role: role };

//     const city = req.params.city;
//     if (city !== "all") {
//       query.city = city;
//     }

//     const userState = req.params.userState;
//     if (userState !== "all") {
//       query.userState = userState;
//     }
    
//     const users = await User.find(query); 
//     res.json(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// Controller logic for filtering all users with the same CITY + ROLE + STATE//WORKS
// router.get("/filter/:city/:role/:userState", async (req, res) => {
//   try {
//     const state =req.params.userState;
//     const role = req.params.role;
//     const city = req.params.city;
//     const users = await User.find
//     ({ city: city, role: role, userState: state }); // Find users with the specified city
//     res.json(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

//Filter for the appointment to find the best match between volunteer and olduser
// router.get("/filter/:city/:role/:userState", async (req, res) => {
//   try {
//     const city = req.params.city;
//     const role = req.params.role;
//     const userState = req.params.userState;

//     //Query object with the properties to filter
//     const query = {};

//     // Add city filter if given
//     if (city !== "all") {
//       query.city = city;
//     }

//     // Add role filter if given
//     if (role !== "all") {
//       query.role = role;
//     }

//     // Add userState filter if given
//     if (userState !== "all") {
//       query.userState = userState;
//     }

//     // Find users based on the constructed query
//     const users = await User.find(query);

//     res.json(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

//////ADMINS//////

// // Controller logic for creating an admin //WORKS
// router.post("/registeradmin", async (req, res) => {
//   try {
//     const {
//       name,
//       surname,
//       email,
//       mobile,
//       gender,
//       dateofbirth,
//       nid,
//       country,
//       city,
//       password,
//     } = req.body;
//     const role = "admin"; // Set the role field to "admin"

//     // Check if email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).send("Email address already exists");
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create new user if email is unique + the role
//     const user = new User({
//       name,
//       surname,
//       email,
//       mobile,
//       gender,
//       dateofbirth,
//       nid,
//       country,
//       city,
//       password: hashedPassword,
//       role,
//     });

//     await user.save();

//     res.status(201).send(user);
//   } catch (err) {
//     console.error("Error registering user(volunteer):", err);
//     res.status(500).send("Internal Server Error");
//   }
// });

//////VOLUNTEERS//////

// // Controller logic for getting all volunteers //WORKS
// router.get("/getallvol", async (req, res) => {
//   try {
//     const users = await User.find({ role: "volunteer" });
//     res.send(users);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });
// // Controller logic for getting all active volunteers //WORKS
// router.get("/getallactivevol", async (req, res) => {
//   try {
//     const users = await User.find({ role: "volunteer", userState: "active" });
//     res.send(users);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });
// // Controller logic for getting all inactive volunteers //WORKS
// router.get("/getallinactivevol", async (req, res) => {
//   try {
//     const users = await User.find({ role: "volunteer", userState: "inactive" });
//     res.send(users);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // Route to get a specific user by ID //WORKS
// router.get("/get/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     res.send(user);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // Controller logic for creating a volunteer //WORKS
// router.post("/registervolunteer", async (req, res) => {
//   try {
//     const {
//       name,
//       surname,
//       email,
//       mobile,
//       gender,
//       dateofbirth,
//       nid,
//       country,
//       city,
//       password,
//     } = req.body;
//     const role = "volunteer"; // Set the role field to "volunteer"
//     const userState = "inactive"; // Set the userState to "inactive"

//     // Check if email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).send("Email address already exists");
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create new user if email is unique + role + userState
//     const user = new User({
//       name,
//       surname,
//       email,
//       mobile,
//       gender,
//       dateofbirth,
//       nid,
//       country,
//       city,
//       password: hashedPassword,
//       role,
//       userState,
//     });
//     await user.save();

//     res.status(201).send(user);
//   } catch (err) {
//     console.error("Error registering user(volunteer):", err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// // Route to update a user by ID //WORKS
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

// // Route to delete a user by ID //WORKS
// router.delete("/delete/:id", async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     res.send(user);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

//////OLDUSERS//////

// // Controller logic for getting all users //WORKS
// router.get("/getalloldusers", async (req, res) => {
//   try {
//     const users = await User.find({ role: "olduser" });
//     res.send(users);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });
// // Controller logic for getting all active oldusers //WORKS
// router.get("/getallactiveold", async (req, res) => {
//   try {
//     const users = await User.find({ role: "olduser", userState: "active" });
//     res.send(users);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });
// // Controller logic for getting all inactive oldusers //WORKS
// router.get("/getallinactiveold", async (req, res) => {
//   try {
//     const users = await User.find({ role: "olduser", userState: "inactive" });
//     res.send(users);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // Controller logic for creating an olduser //WORKS
// router.post("/registerolduser", async (req, res) => {
//   try {
//     const {
//       name,
//       surname,
//       email,
//       mobile,
//       gender,
//       dateofbirth,
//       nid,
//       medpapers,
//       country,
//       city,
//       password,
//     } = req.body;
//     const role = "olduser"; // Set the role field to "olduser"

//     // Check if email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).send("Email address already exists");
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create new user if email is unique + the role
//     const user = new User({
//       name,
//       surname,
//       email,
//       mobile,
//       gender,
//       dateofbirth,
//       nid,
//       medpapers,
//       country,
//       city,
//       password: hashedPassword,
//       role,
//     });
//     await user.save();

//     res.status(201).send(user);
//   } catch (err) {
//     console.error("Error registering user(olduser):", err);
//     res.status(500).send("Internal Server Error");
//   }
// });

//////MANAGERS//////

// Controller logic for getting all users
// router.get("/getallmanagers", async (req, res) => {
//   //DOES NOT WORK YET
//   try {
//     const users = await User.find({ role: "manager" });
//     res.send(users);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // Controller logic for creating an olduser //WORKS
// router.post("/registermanager", async (req, res) => {
//   try {
//     const {
//       name,
//       surname,
//       email,
//       mobile,
//       gender,
//       dateofbirth,
//       nid,
//       country,
//       city,
//       password,
//     } = req.body;
//     const role = "manager"; // Set the role field to "manager"

//     // Check if email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).send("Email address already exists");
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create new user if email is unique + the role
//     const user = new User({
//       name,
//       surname,
//       email,
//       mobile,
//       gender,
//       dateofbirth,
//       nid,
//       country,
//       city,
//       password: hashedPassword,
//       role,
//     });
//     await user.save();

//     res.status(201).send(user);
//   } catch (err) {
//     console.error("Error registering user(manager):", err);
//     res.status(500).send("Internal Server Error");
//   }
// });


