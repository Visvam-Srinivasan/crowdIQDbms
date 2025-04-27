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

    if (!adminId) {
        return res.status(400).json({ message: 'Admin ID is required' });
    }

    const query = 'SELECT * FROM events WHERE admin_id = ? AND event_status = "active"';

    db.query(query, [adminId], (err, results) => {
        if (err) {
            console.error('Error fetching events:', err);
            return res.status(500).json({ message: 'Failed to fetch events', error: err });
        }

        // Always return 200, even if no events (frontend will show "Add Events")
        return res.status(200).json(results);
    });
};

exports.markEventAsCompleted = (req, res) => {
    const eventId = req.params.eventId;

    // Basic validation: Check if eventId is provided
    if (!eventId) {
        return res.status(400).json({ message: 'Event ID is required' });
    }

    const query = 'UPDATE events SET event_status = "completed" WHERE event_id = ?';

    db.query(query, [eventId], (err, result) => {
        if (err) {
            console.error('Error updating event status:', err);
            return res.status(500).json({ message: 'Failed to update event status', error: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ message: 'Event status updated to completed' });
    });
};

exports.assignStaffToGates = (req, res) => {
    const staffAssignments = req.body; // 👈 Directly accessing the array

    if (!Array.isArray(staffAssignments) || staffAssignments.length === 0) {
        return res.status(400).json({ message: 'Invalid staff assignments.' });
    }

    // Optional validation: Check if any staff_id is missing or invalid
    const hasInvalid = staffAssignments.some(item =>
        !item.staff_id || typeof item.staff_id !== 'string'
    );

    if (hasInvalid) {
        return res.status(400).json({ message: 'All gates must have a valid staff ID.' });
    }

    const values = staffAssignments.map(item => [
        item.event_id,
        item.staff_id,
        item.quadrant_number,
        item.gate_number
    ]);

    const query = `
        INSERT INTO staffforgates (event_id, staff_id, quadrant_number, gate_number)
        VALUES ?
        ON DUPLICATE KEY UPDATE staff_id = VALUES(staff_id)
    `;

    db.query(query, [values], (err, result) => {
        if (err) {
            console.error('Error inserting staff assignments:', err);
            return res.status(500).json({ message: 'Database error during assignment.' });
        }
        return res.status(201).json({ message: 'Staff assigned to gates successfully.' });
    });
};

exports.getEventDetails = (req, res) => {
    const eventId = req.params.eventId;

    const query = 'SELECT * FROM events WHERE event_id = ?';
    db.query(query, [eventId], (err, results) => {
        if (err) {
            console.error('Error fetching event:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json(results[0]); // Send the first event if found
    });
};

exports.getAssignedStaffForEvent = (req, res) => {
    const { eventId } = req.params;

    const query = `
        SELECT sfg.staff_id, sfg.quadrant_number, sfg.gate_number, u.name
        FROM staffforgates sfg
        LEFT JOIN staffs u ON sfg.staff_id = u.staff_id
        WHERE sfg.event_id = ?
    `;

    db.query(query, [eventId], (err, results) => {
        if (err) {
            console.error("Error fetching staff assignments:", err);
            return res.status(500).json({ message: "Database error" });
        }
        return res.status(200).json(results);
    });
};

exports.getStaffEvents = (req, res) => {
    const { staffId } = req.params;

    const query = `
        SELECT e.event_id, e.event_name, e.event_description, e.event_date, e.event_time, e.event_location,
               sfg.quadrant_number, sfg.gate_number
        FROM events e
        JOIN staffforgates sfg ON e.event_id = sfg.event_id
        WHERE sfg.staff_id = ?
    `;

    db.query(query, [staffId], (err, results) => {
        if (err) {
            console.error("Error fetching events for staff:", err);
            return res.status(500).json({ message: "Database error" });
        }
        return res.status(200).json(results);
    });
};

exports.searchEvent = async (req, res) => {
    const { query } = req.query;
  
    try {
      const sql = `
        SELECT * FROM events 
        WHERE event_id = ? OR event_name LIKE ?
        LIMIT 1
      `;
  
      const values = [query, `%${query}%`];
  
      db.query(sql, values, (err, results) => {
        if (err) return res.status(500).json({ message: 'DB Error' });
        if (results.length === 0) return res.status(404).json({ message: 'Event not found' });
  
        return res.status(200).json(results[0]);
      });
    } catch (error) {
      return res.status(500).json({ message: 'Server Error' });
    }
  };


exports.deleteEvent = (req, res) => {
    const { eventId } = req.body;

    // Basic validation
    if (!eventId || isNaN(Number(eventId))) {
        return res.status(400).json({ message: 'Valid eventId is required' });
    }

    const query = 'DELETE FROM events WHERE event_id = ?';

    db.query(query, [eventId], (err, result) => {
        if (err) {
            console.error('Error deleting event:', err);
            return res.status(500).json({ message: 'Failed to delete event', error: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ message: 'Event deleted successfully' });
    });
};

exports.getAttendeesByEventQuadrantGate = (req, res) => {
    const { eventId, quadrant, gate } = req.params;

    const query = `
        SELECT attendee_id, admission_status, number_of_attendees 
        FROM bookings 
        WHERE event_id = ? AND quadrant_number = ? AND gate_number = ?
    `;

    db.query(query, [eventId, quadrant, gate], (err, results) => {
        if (err) {
            console.error('Error fetching attendees:', err);
            return res.status(500).json({ message: 'Error fetching attendees' });
        }
        res.status(200).json(results);
    });
};

exports.toggleAdmissionStatus = (req, res) => {
    const { attendeeId, admissionStatus } = req.body;

    if (attendeeId === undefined || admissionStatus === undefined) {
        return res.status(400).json({ message: 'Attendee ID and new status are required' });
    }

    const query = `
        UPDATE bookings 
        SET admission_status = ? 
        WHERE attendee_id = ?
    `;

    db.query(query, [admissionStatus, attendeeId], (err, result) => {
        if (err) {
            console.error('Error updating admission status:', err);
            return res.status(500).json({ message: 'Failed to update admission status' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Attendee not found' });
        }

        res.status(200).json({ message: 'Admission status updated successfully' });
    });
};

// controllers/eventController.js

exports.reassignCrowded = (req, res) => {
    const { eventId } = req.body;

    if (!eventId) {
        return res.status(400).json({ message: 'Event ID is required' });
    }

    // Step 1: Find last two attendees of that event ordered by attendee_id descending
    const findLastTwoQuery = `
        SELECT * FROM bookings 
        WHERE event_id = ? 
        ORDER BY attendee_id DESC 
        LIMIT 2
    `;

    db.query(findLastTwoQuery, [eventId], (err, lastTwoAttendees) => {
        if (err) {
            console.error('Error fetching last two attendees:', err);
            return res.status(500).json({ message: 'Failed to fetch last two attendees' });
        }

        if (lastTwoAttendees.length === 0) {
            return res.status(404).json({ message: 'No attendees found' });
        }

        // Step 2: Find the gate with maximum admitted attendees
        const findMaxGateQuery = `
            SELECT gate_number, COUNT(*) AS admitted_count
            FROM bookings
            WHERE event_id = ? AND admission_status = 1
            GROUP BY gate_number
            ORDER BY admitted_count DESC
            LIMIT 1
        `;

        db.query(findMaxGateQuery, [eventId], (err, maxGateResult) => {
            if (err) {
                console.error('Error finding gate with max admitted:', err);
                return res.status(500).json({ message: 'Failed to find gate with max admitted' });
            }

            if (maxGateResult.length === 0) {
                return res.status(404).json({ message: 'No admitted attendees found' });
            }

            const targetGate = maxGateResult[0].gate_number;

            // Step 3: Update the last two attendees to the target gate
            const attendeeIds = lastTwoAttendees.map(a => a.attendee_id);
            const updateQuery = `
                UPDATE bookings
                SET gate_number = ?
                WHERE attendee_id IN (?, ?)
            `;

            db.query(updateQuery, [targetGate, attendeeIds[0], attendeeIds[1]], (err, result) => {
                if (err) {
                    console.error('Error updating attendee gate:', err);
                    return res.status(500).json({ message: 'Failed to update gate' });
                }

                res.status(200).json({ message: 'Attendees reassigned successfully' });
            });
        });
    });
};
