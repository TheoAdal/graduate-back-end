// routes/UserRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Visits = require("../models/Visits");

router.post('/createappointment', async (req, res) => {
    try {
        // Extract appointment data from request body
        const { vol_id, old_id, appointmentdate, appointmenttime, description } = req.body;

        // Retrieve volunteer information
        const volunteer = await User.findById(vol_id);
        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer not found' });
        }
        const volname = volunteer.name;
        const volsurname = volunteer.surname;

        // Retrieve old user information
        const olduser = await User.findById(old_id);
        if (!olduser) {
            return res.status(404).json({ message: 'Old user not found' });
        }
        const oldname = olduser.name;
        const oldsurname = olduser.surname;

        // Check if there is an existing appointment for the volunteer on the same date
        const existingVolunteerAppointment = await Visits.findOne({ vol_id, appointmentdate });
        if (existingVolunteerAppointment) {
            return res.status(409).json({ message: 'Volunteer already has an appointment on this date' });
        }

        // Check if there is an existing appointment for the old user on the same date
        const existingOldUserAppointment = await Visits.findOne({ old_id, appointmentdate });
        if (existingOldUserAppointment) {
            return res.status(409).json({ message: 'Old user already has an appointment on this date' });
        }

        // Create new appointment using Visit model
        const newVisit = new Visits({
            volname,
            volsurname,
            vol_id,
            oldname,
            oldsurname,
            old_id,
            appointmentdate,
            appointmenttime,
            description
        });

        // Save the new appointment to the database
        await newVisit.save();

        // Respond with success message
        res.status(201).json({ message: 'Appointment created successfully', newVisit });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;

