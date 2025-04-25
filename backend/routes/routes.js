const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');
const eventController = require('../controllers/eventController.js');
const bookingController = require('../controllers/bookingController.js');

router.post('/signup/:role', authController.registerUser);
router.post('/login', authController.loginUser);

router.post('/events/createEvent', eventController.createEvent);
router.get('/events/admin/:adminId', eventController.getEventsByAdmin);
router.post('/events/:eventId/complete', eventController.markEventAsCompleted); 

router.post('/events/staffForGates', eventController.assignStaffToGates);
router.get('/events/getEvent/:eventId', eventController.getEventDetails);
router.get('/events/staffAssignments/:eventId', eventController.getAssignedStaffForEvent);
router.get('/events/getStaffAssignment/:staffId', eventController.getStaffEvents);
router.get('/events/deleteEvent/', eventController.deleteEvent);
router.get('/events/getAttendeeList/:eventId/:quadrant/:gate', eventController.getAttendeesByEventQuadrantGate);
router.post('/events/toggleAdmission', eventController.toggleAdmissionStatus);


router.get('/events/searchEvent', eventController.searchEvent);
router.delete('/bookings/delete/:booking_id', bookingController.deleteBooking);
router.post('/bookings/check-and-create', bookingController.checkAndCreateBooking);
router.get('/bookings/getUserBooking', bookingController.getUserBookings);

module.exports = router;
