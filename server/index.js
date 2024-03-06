const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("../DbConfig.js");

//Routes
// const adminRoutes = require("../routes/AdminRoutes");
const managerRoutes = require("../routes/ManagementRoutes");
const volunteerRoutes = require("../routes/VolunteerRoutes");
const oldUserRoutes = require("../routes/OldUserRoutes");

connectDB;
dotenv.config();
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

app.use("/login", (req, res) => {
  res.send({
    token: "test123",
  });
});

// Routes and controllers
// app.use('/admins', adminRoutes);
app.use("/managers", managerRoutes);
app.use("/volunteers", volunteerRoutes);
app.use("/olduser", oldUserRoutes);

app.get("/", (_req, res) => {
  res.send("<h1>VRWMAAAAAAAA</h1>");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
