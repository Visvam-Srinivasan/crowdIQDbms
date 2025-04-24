import React, { useEffect, useState } from 'react';
import API from '../../api';

const AttendeeBookings = ({ bookings, setUserBookings }) => {
  const [eventDetails, setEventDetails] = useState({});

  useEffect(() => {
    const fetchEventDetails = async () => {
      const details = {};
      for (const booking of bookings) {
        if (!details[booking.event_id]) {
          try {
            const response = await API.get('/events/searchEvent', {
              params: { query: booking.event_id },
            });
            if (response.data) {
              details[booking.event_id] = response.data;
            }
          } catch (err) {
            console.error(`Failed to fetch event ${booking.event_id}`, err);
          }
        }
      }
      setEventDetails(details);
    };

    if (bookings.length) fetchEventDetails();
  }, [bookings]);

  const handleCancel = async (bookingId) => {
    try {
      const confirmed = window.confirm('Are you sure you want to cancel this booking?');
      if (!confirmed) return;
      await API.delete(`/bookings/delete/${bookingId}`);

      setUserBookings((prev) => prev.filter((b) => b.booking_id !== bookingId));
    } catch (err) {
      alert('Failed to cancel booking');
      console.error(err);
    }
  };

  return (
    <div className="bg-white mt-10 px-4 py-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">Your Bookings</h3>
      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">No bookings yet.</p>
      ) : (
        <ul className="space-y-6">
          {bookings.map((booking, i) => {
            const event = eventDetails[booking.event_id];
            return (
              <li
                key={i}
                className="bg-gray-100 p-5 rounded-lg shadow-md hover:bg-gray-100 transition duration-300 ease-in-out"
              >
                {event && (
                  <div>
                    <h4 className="text-xl font-bold mb-4 text-center">{event.event_name}</h4>
                    <table className="min-w-full text-left border border-gray-300 dark:border-gray-600">
                      <tbody>
                        <tr className="border-b border-gray-200 dark:border-gray-600">
                          <th className="py-2 px-4 font-medium">Description</th>
                          <td className="py-2 px-4">{event.event_description}</td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-gray-600">
                          <th className="py-2 px-4 font-medium">Date</th>
                          <td className="py-2 px-4">{event.event_date}</td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-gray-600">
                          <th className="py-2 px-4 font-medium">Time</th>
                          <td className="py-2 px-4">{event.event_time}</td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-gray-600">
                          <th className="py-2 px-4 font-medium">Location</th>
                          <td className="py-2 px-4">{event.event_location}</td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-gray-600">
                          <th className="py-2 px-4 font-medium">Seating Type</th>
                          <td className="py-2 px-4">{event.seating_type}</td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-gray-600">
                          <th className="py-2 px-4 font-medium">Quadrant</th>
                          <td className="py-2 px-4">{booking.quadrant_number}</td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-gray-600">
                          <th className="py-2 px-4 font-medium">Gate</th>
                          <td className="py-2 px-4">{booking.gate_number}</td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-gray-600">
                          <th className="py-2 px-4 font-medium">Number of People</th>
                          <td className="py-2 px-4">{booking.number_of_attendees}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="text-center mt-6">
                    <button
                        onClick={() => handleCancel(booking.booking_id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
                      >
                        CANCEL BOOKING
                    </button>
                    </div>
                    </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AttendeeBookings;
