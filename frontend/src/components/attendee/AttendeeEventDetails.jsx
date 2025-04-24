import React from 'react';

const AttendeeEventDetails = ({ event, onCheckAvailability }) => (
  <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 mx-auto max-w-xl text-black dark:text-white">
    <h3 className="text-2xl font-bold mb-4 text-center">{event.event_name}</h3>
    
    <div className="overflow-x-auto">
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
          {event.number_of_quadrants && (
            <tr className="border-b border-gray-200 dark:border-gray-600">
              <th className="py-2 px-4 font-medium">Number of Quadrants</th>
              <td className="py-2 px-4">{event.number_of_quadrants}</td>
            </tr>
          )}
          {event.attendees_per_quadrant && (
            <tr className="border-b border-gray-200 dark:border-gray-600">
              <th className="py-2 px-4 font-medium">Attendee Limit</th>
              <td className="py-2 px-4">
                {event.attendees_per_quadrant * event.number_of_quadrants}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    <div className="text-center mt-6">
      <button
        onClick={onCheckAvailability}
        className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
      >
        Check Seats
      </button>
    </div>
  </div>
);

export default AttendeeEventDetails;
