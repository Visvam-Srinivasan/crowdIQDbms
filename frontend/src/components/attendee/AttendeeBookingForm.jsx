import React from 'react';

const AttendeeBookingForm = ({
  numberOfQuadrants,
  quadrantNumber,
  setQuadrantNumber,
  numberOfAttendees,
  setNumberOfAttendees,
  handleBookingSubmit,
}) => (
  <div className="mt-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
    <h4 className="text-lg font-semibold mb-4 text-white">Booking Form</h4>

      <select
        value={quadrantNumber}
        onChange={(e) => setQuadrantNumber(Number(e.target.value))}
        className="block mb-3 p-2 w-full border rounded text-white bg-gray-800"
      >

      {Array.from({ length: numberOfQuadrants }, (_, index) => (
        <option key={index} value={index + 1}>
          Quadrant {index + 1}
        </option>
      ))}
    </select>

      <input
        type="number"
        placeholder="Number of Attendees"
        value={numberOfAttendees}
        onChange={(e) => setNumberOfAttendees(Number(e.target.value))}
        className="block mb-3 p-2 w-full border rounded text-white bg-gray-800"
      />

    <div className="text-center mt-6">
      <button
        onClick={handleBookingSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Book
      </button>
    </div>
  </div>
);

export default AttendeeBookingForm;
