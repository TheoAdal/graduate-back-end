// routes/UserRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//Controller logic for login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

  res.send({ token });
});

//////ADMINS//////

// Controller logic for creating an admin //WORKS
router.post("/registeradmin", async (req, res) => {
    try {
      const { name, surname, email, mobile, country, city, password } = req.body;
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

//////VOLUNTEERS//////

// Controller logic for getting all users //WORKS
router.get("/getallvol", async (req, res) => {
  try {
    const users = await User.find({role: "volunteer" });
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
    const { name, surname, email, mobile, country, city, password } = req.body;
    const role = "volunteer"; // Set the role field to "volunteer"

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

// Route to update a user by ID //WORKS
router.patch("/patch/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(User);
  } catch (err) {
    res.status(400).send(err);
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

//////OLDUSERS//////

// Controller logic for getting all users //DOES NOT WORK YET
router.get("/getalloldusers", async (req, res) => {
  try {
    const users = await User.find({role: "olduser" });
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Controller logic for creating an olduser //WORKS
router.post("/registerolduser", async (req, res) => {
  try {
    const { name, surname, email, mobile, country, city, password } = req.body;
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

//////MANAGERS//////
// Controller logic for getting all users 
router.get("/getallmanagers", async (req, res) => {//DOES NOT WORK YET
  try {
    const users = await User.find({role: "manager" });
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Controller logic for creating an olduser //WORKS
router.post("/registermanager", async (req, res) => {
  try {
    const { name, surname, email, mobile, country, city, password } = req.body;
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


module.exports = router;
