const db = require('../config/db.config');

exports.createEvent = (req, res) => {
    const {
        eventName,
        eventDescription,
        eventDate,
        eventTime,
        eventLocation,
        adminId,
        seatingType,
        numberOfQuadrants,
        attendeesPerQuadrant,
        numberOfGatesPerQuadrant,
    } = req.body;

    // Basic Validation (Double check on backend)
    if (!eventName || !eventDescription || !eventDate || !eventTime || !eventLocation || !adminId || !seatingType || !numberOfQuadrants || !attendeesPerQuadrant || !numberOfGatesPerQuadrant) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (isNaN(Number(numberOfQuadrants)) || Number(numberOfQuadrants) <= 0) {
        return res.status(400).json({ message: 'Number of quadrants must be a number greater than 0' });
    }
    if (isNaN(Number(attendeesPerQuadrant)) || Number(attendeesPerQuadrant) <= 0) {
        return res.status(400).json({ message: 'Attendees per quadrant must be a number greater than 0' });
    }

    if (isNaN(Number(numberOfGatesPerQuadrant)) || Number(numberOfGatesPerQuadrant) <= 0) {
        return res.status(400).json({ message: 'Number of gates per quadrant must be a number greater than 0' });
    }

    const query = 'INSERT INTO events (event_name, event_description, event_date, event_time, event_location, admin_id, seating_type, number_of_quadrants, attendees_per_quadrant, number_of_gates_per_quadrant) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(
        query,
        [eventName, eventDescription, eventDate, eventTime, eventLocation, adminId, seatingType, numberOfQuadrants, attendeesPerQuadrant, numberOfGatesPerQuadrant],
        (err, results) => {
            if (err) {
                console.error('Error creating event:', err);
                return res.status(500).json({ message: 'Failed to create event', error: err });
            }
            res.status(201).json({ message: 'Event created successfully', eventId: results.insertId });
        }
    );
};

exports.getEventsByAdmin = (req, res) => {
    const adminId = req.params.adminId;

    // Basic validation: Check if adminId is provided
    if (!adminId) {
        return res.status(400).json({ message: 'Admin ID is required' });
    }

    const query = 'SELECT * FROM events WHERE admin_id = ?'; //  Query

    db.query(query, [adminId], (err, results) => {
        if (err) {
            console.error('Error fetching events:', err);
            return res.status(500).json({ message: 'Failed to fetch events', error: err });
        }

        if (results.length === 0) {
            //  No events found for this admin
            return res.status(404).json([]);
        }

        //  Events found
        res.status(200).json(results);
    });
};
