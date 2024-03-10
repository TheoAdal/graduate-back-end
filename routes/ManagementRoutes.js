// routes/ManagementRoutes.js
const express = require("express");
const router = express.Router();
const Manager = require("../models/Management");

// Controller logic for getting all managers
router.get("/getall", async (req, res) => {
  try {
    const managers = await Manager.find();
    res.send(managers);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route to get a specific manager user by ID
router.get("/get/:id", async (req, res) => {
  try {
    const manager = await Manager.findById(req.params.id);
    if (!manager) {
      return res.status(404).send("Manager not found");
    }
    res.send(manager);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Controller logic for creating a manager
router.post(
  "/register",
  (createUser = (req, res) => {
    try {
      const manager = new Manager(req.body);
      manager.save();
      res.status(201).send(manager);
    } catch (err) {
      res.status(400).send(err);
    }
  })
);

// Route to update a manager user by ID
router.patch("/patch/:id", async (req, res) => {
  try {
    const manager = await Manager.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!manager) {
      return res.status(404).send("Manager not found");
    }
    res.send(manager);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Route to delete a manager user by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const manager = await Manager.findByIdAndDelete(req.params.id);
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
