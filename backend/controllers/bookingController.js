const db = require('../config/db.config');

exports.checkAvailability = async (req, res) => {
  const { event_id } = req.query;

  try {
    const eventQuery = 'SELECT number_of_quadrants, attendees_per_quadrant FROM events WHERE event_id = ?';
    const [eventResult] = await db.execute(eventQuery, [event_id]);

    if (!eventResult.length) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const { number_of_quadrants, attendees_per_quadrant } = eventResult[0];

    const countsQuery = `
      SELECT quadrant_number, SUM(number_of_attendees) AS total_attendees
      FROM bookings
      WHERE event_id = ?
      GROUP BY quadrant_number
    `;
    const [bookingCounts] = await db.execute(countsQuery, [event_id]);

    const quadrantStatus = {};
    for (let i = 1; i <= number_of_quadrants; i++) {
      const booked = bookingCounts.find(b => b.quadrant_number === i);
      quadrantStatus[i] = booked ? booked.total_attendees < attendees_per_quadrant : true;
    }

    res.json({ quadrantStatus, number_of_quadrants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error checking availability' });
  }
};

exports.getUserBookings = async (req, res) => {
    const { attendee_id } = req.query;
  
    if (!attendee_id) return res.status(400).json({ message: 'Attendee ID is required' });
  
    try {
      const [bookings] = await db.query(
        'SELECT * FROM bookings WHERE user_id = ?',
        [attendee_id]
      );
  
      res.status(200).json(bookings);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
};


exports.deleteBooking = (req, res) => {
  const { booking_id } = req.params;

  db.query('DELETE FROM bookings WHERE booking_id = ?', [booking_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking cancelled successfully' });
  });
};


exports.checkAndCreateBooking = (req, res) => {
  const { event_id, quadrant_number, number_of_attendees, attendee_id } = req.body;

  if (!event_id || !quadrant_number || !number_of_attendees || !attendee_id) {
    return res.status(400).json({ message: 'Missing booking information' });
  }

  // 1. Get event details: max attendees per quadrant and number of gates per quadrant
  db.query(
    'SELECT attendees_per_quadrant, number_of_gates_per_quadrant FROM events WHERE event_id = ?',
    [event_id],
    (err, eventRows) => {
      if (err) return res.status(500).json({ message: 'DB error 1', error: err });
      if (eventRows.length === 0) return res.status(404).json({ message: 'Event not found' });

      const maxSeats = eventRows[0].attendees_per_quadrant;
      const numberOfGates = eventRows[0].number_of_gates_per_quadrant;

      // 2. Get total attendees already booked in the specified quadrant
      db.query(
        'SELECT COALESCE(SUM(number_of_attendees), 0) AS total FROM bookings WHERE event_id = ? AND quadrant_number = ?',
        [event_id, quadrant_number],
        (err, sumRows) => {
          if (err) return res.status(500).json({ message: 'DB error 2', error: err });

          const totalBooked = sumRows[0].total;

          if (totalBooked + Number(number_of_attendees) > maxSeats) {
            return res.status(400).json({
              message: `Quadrant ${quadrant_number} can't occupy ${number_of_attendees} attendees. Reduce attendees or change quadrant.`,
            });
          }

          // 3. Get the gate number for the booking (sequential)
          db.query(
            'SELECT COUNT(*) AS count FROM bookings WHERE event_id = ? AND quadrant_number = ?',
            [event_id, quadrant_number],
            (err, gateCountRows) => {
              if (err) return res.status(500).json({ message: 'DB error 3', error: err });

              const gateCount = gateCountRows[0].count;
              const gateNumber = (gateCount % numberOfGates) + 1; // Assign gate number, looping back after the last gate
              console.log("Gate number chosen for booking: " + gateNumber);
              // 4. Create booking
              db.query(
                'INSERT INTO bookings (event_id, quadrant_number, gate_number, number_of_attendees, attendee_id) VALUES (?, ?, ?, ?, ?)',
                [event_id, quadrant_number, gateNumber, number_of_attendees, attendee_id],
                (err, result) => {
                  if (err) return res.status(500).json({ message: 'DB error 4', error: err });

                  return res.status(201).json({
                    message: 'Booking successful',
                    assignedGate: gateNumber,
                  });
                }
              );
            }
          );
        }
      );
    }
  );
};

exports.getUserBookings = (req, res) => {
  const { attendee_id } = req.query;

  if (!attendee_id) {
    return res.status(400).json({ message: 'Attendee ID is required' });
  }

  db.query(
    'SELECT * FROM bookings WHERE attendee_id = ?',
    [attendee_id],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
      }

      res.status(200).json(results);
    }
  );
};


