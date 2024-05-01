// routes/AppointmentRequestRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const AppointmentRequest = require("../models/AppointmentRequest");
const { calculateAge, categorizeAge } = require("../utils/ageUtils");

router.post("/create", async (req, res) => {
    try {
      const { oldUserId, appointmentDate } = req.body;
  
      // Check if the parsed appointmentDate is valid
      const parsedAppointmentDate = new Date(appointmentDate);
      if (isNaN(parsedAppointmentDate.getTime())) {
        return res.status(400).json({ message: "Invalid appointmentDate value" });
      }
      // Format the appointment date as YYYY-MM-DD
      const formattedAppointmentDate = parsedAppointmentDate.toISOString().split("T")[0];
  
      // Check if there's an existing request with the same appointment date and oldUserId
      const existingRequest = await AppointmentRequest.findOne({ oldUserId, appointmentDate: formattedAppointmentDate });
      if (existingRequest) {
        return res.status(400).json({ message: "An appointment already exists for this date" });
      }
  
      // Parse requestDate string to Date object (assuming it's already in date format)
      const requestDate = new Date();
      // Format the request date as YYYY-MM-DD
      const formattedRequestDate = requestDate.toISOString().split("T")[0];
  
      const newRequest = new AppointmentRequest({
        oldUserId,
        appointmentDate: formattedAppointmentDate,
        requestDate: formattedRequestDate,
        ...req.body
      });
      await newRequest.save();
      res.status(201).json(newRequest);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

router.get("/volunteer/requests", async (req, res) => {
  const { ageRange, city, gender } = req.query;
  try {
    const requests = await AppointmentRequest.find({
      preferredAge: ageRange,
      preferredCity: city,
      preferredGender: gender,
      status: "pending",
    });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Accept an appointment request
router.patch("/accept/:id", async (req, res) => {
  try {
    const { volunteerId } = req.body; // ID of the volunteer accepting the request
    const request = await AppointmentRequest.findByIdAndUpdate(
      req.params.id,
      {
        status: "accepted",
        acceptedBy: volunteerId,
      },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ message: "Request accepted", request });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

// Decline an appointment request
// router.patch("/decline/:id", async (req, res) => {
//   try {
//     const request = await AppointmentRequest.findByIdAndUpdate(
//       req.params.id,
//       {
//         status: "declined",
//       },
//       { new: true }
//     );

//     if (!request) {
//       return res.status(404).json({ message: "Request not found" });
//     }

//     res.status(200).json({ message: "Request declined", request });
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error", error });
//   }
// });

router.get("/users/by-age-range", async (req, res) => {
  try {
    const users = await User.find();
    const filteredUsers = users.filter((user) => {
      const age = calculateAge(user.birthdate);
      const ageRange = categorizeAge(age);
      return ageRange === req.query.ageRange; // Assuming ageRange is passed as a query parameter
    });

    res.status(200).json(filteredUsers);
  } catch (error) {
    res.status(500).send("Error fetching users: " + error.message);
  }
});

// GET accepted appointment requests for a specific user
router.get('/appointmentrequests/accepted/:id', async (req, res) => {
    const { userId } = req.params;

    try {
        // Query the database for accepted appointment requests associated with the userId
        const acceptedRequests = await AppointmentRequest.find({
            $or: [
                { oldUserId: userId },
                { volunteerId: userId }
            ],
            status: 'accepted'
            
        })
        .populate('oldUserId', 'name surname mobile') // Populate olduser details
        .populate('acceptedBy', 'name surname mobile') // Populate volunteer details
        .exec();

        res.status(200).json(acceptedRequests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
