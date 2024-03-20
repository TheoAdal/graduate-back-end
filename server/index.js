const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const connectDB = require("../DbConfig.js");
const User = require("../models/User");

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 10 //required by bcrypt

//Routes
const userRoutes = require("../routes/UserRoutes");
// const adminRoutes = require("../routes/AdminRoutes");
// const managerRoutes = require("../routes/ManagementRoutes");
// const volunteerRoutes = require("../routes/VolunteerRoutes");
// const oldUserRoutes = require("../routes/OldUserRoutes");

connectDB;
dotenv.config();
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });

//   if (!user) return res.status(400).send("Invalid email or password.");

//   const validPassword = await bcrypt.compare(password, user.password);

//   if (!validPassword)
//     return res.status(400).send("Invalid username or password.");

//      //send role to frontend
//      res.send({ token, role: user.role });

//   const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

//   res.send({ token });
// });

app.post("/login", (req, res) => {
  res.send({token: "test123",});
});

// Routes and controllers
app.use('/users', userRoutes);
// app.use('/admins', adminRoutes);
// app.use("/managers", managerRoutes);
// app.use("/volunteers", volunteerRoutes);
// app.use("/olduser", oldUserRoutes);

app.get("/", (_req, res) => {
  res.send("<h1>VRWMAAAAAAAA</h1>");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});