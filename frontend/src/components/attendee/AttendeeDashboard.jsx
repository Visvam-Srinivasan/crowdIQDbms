import React, { useState, useEffect } from 'react';
import API from '../../api';
import AttendeeBookingForm from './AttendeeBookingForm';
import AttendeeBookings from './AttendeeBookings';
import AttendeeEventDetails from './AttendeeEventDetails';
import AttendeeSearchBar from './AttendeeSearchBar';

const AttendeeDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [eventDetails, setEventDetails] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const [quadrantNumber, setQuadrantNumber] = useState(1);
  const [numberOfAttendees, setNumberOfAttendees] = useState(1);
  const [userBookings, setUserBookings] = useState([]);

  const attendeeID = localStorage.getItem('userId');
  const attendeeName = localStorage.getItem('userName');   // Assuming staff's user ID is stored in localStorage

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        if (!attendeeID) return;

        const res = await API.get('/bookings/getUserBooking', {
          params: { attendee_id: attendeeID },
        });
  
        setUserBookings(res.data);
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchUserBookings();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setEventDetails(null);  // Hide event details when input is empty
      setShowBookingForm(false); // Also hide the booking form
      return setError('Please enter an event ID or name');
    }

    setLoading(true);
    setError('');
    try {
      const response = await API.get(`/events/searchEvent`, { params: { query: searchTerm } });
      if (response.status === 200) {
        setEventDetails(response.data);
        setShowBookingForm(false);
      }
    } catch (err) {
      setError('Event not found');
    } finally {
      setLoading(false);
    }
  };


  const handleBookingSubmit = async () => {
    /*
    if (!attendeeID || !eventDetails || !eventDetails.event_id || !quadrantNumber) {
      setError('Missing required booking information.');
      return;
    }
      
    console.log({
      event_id: eventDetails?.event_id,
      quadrant_number: quadrantNumber,
      number_of_attendees: numberOfAttendees,
      attendee_id: attendeeID,
      attendee_name: attendeeName
    });
  */
    try {
      const res = await API.post('/bookings/check-and-create', {
        event_id: eventDetails.event_id,           // Ensure eventDetails contains event_id
        quadrant_number: quadrantNumber,           // Ensure quadrantNumber is not undefined
        number_of_attendees: numberOfAttendees,    // Ensure this is a valid number
        attendee_id: attendeeID,                  // Ensure attendeeID is available
      });
  
      if (res.status === 201) {
        alert('Booking successful! Assigned to Gate ' + res.data.assignedGate + ' \nREFRESH TO SEE YOUR BOOKING!');
        setShowBookingForm(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed');
    }
  };
  
  

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-lg mb-8">
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">Your Bookings</h2>
      </section>

      <AttendeeSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={handleSearch} />
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}
      {eventDetails && (
        <>
          <AttendeeEventDetails event={eventDetails} onCheckAvailability={() => setShowBookingForm(showBookingForm => !showBookingForm)} />
          {showBookingForm && (
            <AttendeeBookingForm
              quadrantNumber={quadrantNumber}
              setQuadrantNumber={setQuadrantNumber}
              numberOfAttendees={numberOfAttendees}
              setNumberOfAttendees={setNumberOfAttendees}
              numberOfQuadrants={eventDetails.number_of_quadrants}
              handleBookingSubmit={handleBookingSubmit}
            />
          )}
        </>
      )}

      <AttendeeBookings bookings={userBookings} setUserBookings={setUserBookings} />
    </div>
  );
};

export default AttendeeDashboard;
