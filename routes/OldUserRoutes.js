// routes/OldUserRoutes.js
const express = require("express");
const router = express.Router();
const OldUser = require("../models/OldUser");

// Controller logic for getting all oldUsers
router.get("/getall", async (req, res) => {
  try {
    const oldUsers = await OldUser.find();
    res.send(oldUsers);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route to get a specific oldUser user by ID
router.get("/get/:id", async (req, res) => {
  try {
    const oldUser = await OldUser.findById(req.params.id);
    if (!oldUser) {
      return res.status(404).send("Old user not found");
    }
    res.send(oldUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Controller logic for creating an oldUser
router.post("/register", createUser = (req, res) => {
  try {
    const { name, surname, email, mobile, country, city, password } = req.body;
    const oldUser = new OldUser({ name, surname, email, mobile, country, city, password });
    oldUser.save();
    res.status(201).send(oldUser);
  } catch (err) {
    console.error("Error registering volunteer:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Route to update an oldUser user by ID
router.patch("/patch/:id", async (req, res) => {
  try {
    const oldUser = await OldUser.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!oldUser) {
      return res.status(404).send("Old user not found");
    }
    res.send(oldUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Route to delete an oldUser user by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const oldUser = await OldUser.findByIdAndDelete(req.params.id);
    if (!oldUser) {
      return res.status(404).send("Old user not found");
    }
    res.send(oldUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Define more routes as needed

module.exports = router;
