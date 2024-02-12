const express = require("express");
const mongoose = require("mongoose");
const adminRoutes = require("../routes/AdminRoutes"); //Routes
// const managerRoutes = require('./routes/ManagementRoutes');
const volunteerRoutes = require("../routes/VolunteerRoutes");
// const oldUserRoutes = require('./routes/OldUserRoutes');

// Connect to MongoDB database
mongoose
  .connect("mongodb://localhost/graduate_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Create Express app
const app = express();

// Routes and controllers
app.use('/volunteers', volunteerRoutes);
// app.use('/admins', adminRoutes);
// app.use('/managers', managerRoutes);
// app.use('/oldUsers', oldUserRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
