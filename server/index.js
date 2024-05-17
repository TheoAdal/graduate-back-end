const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = express.Router();
const app = express();
const connectDB = require("../DbConfig.js");

const User = require("../models/User");
const Visits = require("../models/Visits");
const Token = require("../models/Token");
const sendEmail = require("../utils/SendEmail");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10; //required by bcrypt
const crypto = require("crypto");
 
//Routes
const userRoutes = require("../routes/UserRoutes");
const visitRoutes = require("../routes/VisitRoutes");
const adminRoutes = require("../routes/AdminRoutes");
const managerRoutes = require("../routes/ManagementRoutes");
const volunteerRoutes = require("../routes/VolunteerRoutes");
const oldUserRoutes = require("../routes/OldUserRoutes");
const appointmentRequestRoutes = require('../routes/AppointmentRequestRoutes');


connectDB;
dotenv.config();
app.use(express.json());


app.use(
  cors({
    origin: "http://localhost:3000", //DELETE THIS
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) return res.status(400).send("Invalid email or password.");

  if (!user.verified) return res.status(403).send("Please verify your email.");

  if (user.userState == "inactive") return res.status(403).send("Your account is disabled, please contact us to revert your account state");

  const { _id, name, surname, role } = user;
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);

  //send role + name + surname + token + _id to frontend 
  res.send({ token, _id, name, surname, role });
});

router.patch("/patch/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Routes and controllers
app.use("/users", userRoutes);
app.use("/visits", visitRoutes);
app.use("/admins", adminRoutes);
app.use("/managers", managerRoutes);
app.use("/volunteers", volunteerRoutes);
app.use("/oldusers", oldUserRoutes);
app.use("/requests", appointmentRequestRoutes);

app.get("/", (_req, res) => {
  res.send("<h1>Dont mind me, just checking in :)</h1>");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
