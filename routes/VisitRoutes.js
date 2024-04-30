// routes/VisitRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Visits = require("../models/Visits");

router.get('/getappointment/:id', async (req, res) => {
    try {
        const appointmentId = req.params.id;

        // Find the appointment by ID
        const appointment = await Visits.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json({ appointment });
    } catch (error) {
        console.error('Error retrieving appointment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/getuserappointments/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        // Find appointments for the user
        const userAppointments = await Visits.find({
            $or: [{ vol_id: userId }, { old_id: userId }]
        });

        if (!userAppointments) {
            return res.status(404).json({ message: 'Appointments not found for this user' });
        }

        res.status(200).json({ userAppointments });
    } catch (error) {
        console.error('Error retrieving user appointments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/getallpendinguvolappointment/:vol_id', async (req, res) => {
    try {
        const volunteerId = req.params.vol_id;

        // Get current date
        const currentDate = new Date();

        // Find pending appointments for the user
        const pendingAppointments = await Visits.find({
            vol_id: volunteerId,
            appointmentdate: { $gte: currentDate.toISOString().split('T')[0] }
        });

        res.status(200).json({ pendingAppointments });
    } catch (error) {
        console.error('Error retrieving pending user appointments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/getallexpiredvolappointment/:vol_id', async (req, res) => {
    try {
        const volunteerId = req.params.vol_id;

        // Get current date
        const currentDate = new Date();

        // Find expired appointments for the volunteer
        const expiredAppointments = await Visits.find({
            vol_id: volunteerId,
            appointmentdate: { $lt: currentDate.toISOString().split('T')[0] }
        });

        res.status(200).json({ expiredAppointments });
    } catch (error) {
        console.error('Error retrieving expired user appointments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/getallpendingolduserappointment/:old_id', async (req, res) => {
    try {
        const oldUserId = req.params.old_id;

        // Get current date
        const currentDate = new Date();

        // Find pending appointments for the user
        const pendingAppointments = await Visits.find({
            old_id: oldUserId,
            appointmentdate: { $gte: currentDate.toISOString().split('T')[0] }
        });

        res.status(200).json({ pendingAppointments });
    } catch (error) {
        console.error('Error retrieving pending user appointments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/getallexpiredolduserappointment/:old_id', async (req, res) => {
    try {
        const oldUserId = req.params.old_id;

        // Get current date
        const currentDate = new Date();

        // Find expired appointments for the volunteer
        const expiredAppointments = await Visits.find({
            old_id: oldUserId,
            appointmentdate: { $lt: currentDate.toISOString().split('T')[0] }
        });

        res.status(200).json({ expiredAppointments });
    } catch (error) {
        console.error('Error retrieving expired user appointments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

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
        const vol_number = volunteer.mobile;

        // Retrieve old user information
        const olduser = await User.findById(old_id);
        if (!olduser) {
            return res.status(404).json({ message: 'Old user not found' });
        }
        const oldname = olduser.name;
        const oldsurname = olduser.surname;
        const old_number = olduser.mobile;

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
            vol_number,
            oldname,
            oldsurname,
            old_id,
            old_number,
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

router.get('/getallappointments', async (req, res) => {
    try {
      // Fetch all appointments from the database
      const allAppointments = await Visits.find();
  
      // If there are no appointments, send a 404 response
      if (!allAppointments || allAppointments.length === 0) {
        return res.status(404).json({ message: 'No appointments found' });
      }
  
      // If appointments are found, send them in the response
      res.status(200).json(allAppointments);
    } catch (error) {
      // If an error occurs, send a 500 response with the error message
      console.error('Error fetching appointments:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.get('/getallpendingappointments', async (req, res) => {
    try {
      // Get current date
      const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  
      // Fetch pending appointments from db
      const pendingAppointments = await Visits.find({ appointmentdate: { $gte: currentDate } });
  
      // If no pending appointments, send error message
      if (!pendingAppointments || pendingAppointments.length === 0) {
        return res.status(404).json({ message: 'No pending appointments found' });
      }
  
      // If pending appointments, send response
      res.status(200).json(pendingAppointments);
    } catch (error) {
      // If error , send error message
      console.error('Error fetching pending appointments:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.get('/getallexpiredappointments', async (req, res) => {
    try {
        // Get current date
        const currentDate = new Date();
        // Convert it to a string in the format YYYY-MM-DD
        const formattedCurrentDate = currentDate.toISOString().split('T')[0];

        // Fetch all appointments where the appointment date is before the current date
        const expiredAppointments = await Visits.find({ appointmentdate: { $lt: formattedCurrentDate } });

        // Send the expired appointments as the response
        res.status(200).json({ expiredAppointments });
    } catch (error) {
        console.error('Error fetching expired appointments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/deleteappointment/:id', async (req, res) => {
    try {
        const appointmentId = req.params.id;

        // Find the appointment by ID and delete it
        const deletedAppointment = await Visits.findByIdAndDelete(appointmentId);

        if (!deletedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json({ message: 'Appointment deleted successfully', deletedAppointment });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;

