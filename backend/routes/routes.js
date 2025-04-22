const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');
const eventController = require('../controllers/eventController.js');

router.post('/signup/:role', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/events/createEvent', eventController.createEvent);
router.get('/events/admin/:adminId', eventController.getEventsByAdmin);
router.post('/events/:eventId/complete', eventController.markEventAsCompleted); 
router.post('/events/staffForGates', eventController.assignStaffToGates);
router.get('/events/getEvent/:eventId', eventController.getEventDetails);
router.get('/events/staffAssignments/:eventId', eventController.getAssignedStaffForEvent);

module.exports = router;
