import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';

const StaffDashboard = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEventAttendees, setSelectedEventAttendees] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const staffId = localStorage.getItem('userId');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            if (!staffId) {
                setError('Staff ID not found. Please log in.');
                setLoading(false);
                return;
            }

            try {
                const response = await API.get(`/events/getStaffAssignment/${staffId}`);
                if (response.status === 200) {
                    setEvents(response.data);
                } else {
                    setError('Unexpected response status');
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch assigned events.');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [staffId]);

    const handleViewAttendees = async (eventId, quadrant, gate) => {
        console.log(eventId + " " + quadrant + " " + gate);
        try {
            const response = await API.get(`/events/getAttendeeList/${eventId}/${quadrant}/${gate}`);
            if (response.status === 200) {
                setSelectedEventAttendees(response.data);
                setSelectedEventId(eventId);
            }
        } catch (err) {
            console.error("Error fetching attendees:", err);
            alert("Failed to fetch attendees.");
        }
    };

    const handleAdmit = async (attendeeId) => {
        // Always read the latest state
        setSelectedEventAttendees((prevAttendees) => {
            const updatedAttendees = prevAttendees.map((attendee) => {
                if (attendee.attendee_id === attendeeId) {
                    const newStatus = attendee.admission_status === 1 ? 0 : 1;
    
                    // Send the request inside setState to avoid stale state
                    API.post('/events/toggleAdmission', {
                        attendeeId,
                        admissionStatus: newStatus,
                    }).catch((err) => {
                        console.error('Failed to toggle admission:', err);
                        alert('Failed to toggle admission status.');
                    });
    
                    return {
                        ...attendee,
                        admission_status: newStatus,
                    };
                }
                return attendee;
            });
    
            return updatedAttendees;
        });
    };
    
    
    
    if (loading) {
        return <div className="container mx-auto px-4 py-8 text-center"><p>Loading assigned events...</p></div>;
    }

    if (error) {
        return <div className="container mx-auto px-4 py-8 text-center text-red-600"><p>Error: {error}</p></div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <section className="text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-lg mb-8">
                <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">Staff Dashboard</h2>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Your Assigned Events</h3>
            </section>

            {events.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">You are not assigned to any events.</p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <table className="min-w-full table-auto text-left border-collapse mb-8">
                        <thead className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white">
                            <tr>
                                <th className="py-2 px-4">Event Name</th>
                                <th className="py-2 px-4">Description</th>
                                <th className="py-2 px-4">Date</th>
                                <th className="py-2 px-4">Time</th>
                                <th className="py-2 px-4">Location</th>
                                <th className="py-2 px-4">Quadrant</th>
                                <th className="py-2 px-4">Gate</th>
                                <th className="py-2 px-4">Attendees</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event.event_id} className="bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                                    <td className="py-2 px-4 text-gray-900 dark:text-white">{event.event_name}</td>
                                    <td className="py-2 px-4 text-gray-600 dark:text-gray-300">{event.event_description}</td>
                                    <td className="py-2 px-4 text-gray-600 dark:text-gray-300">{event.event_date}</td>
                                    <td className="py-2 px-4 text-gray-600 dark:text-gray-300">{event.event_time}</td>
                                    <td className="py-2 px-4 text-gray-600 dark:text-gray-300">{event.event_location}</td>
                                    <td className="py-2 px-4 text-gray-600 dark:text-gray-300">{event.quadrant_number}</td>
                                    <td className="py-2 px-4 text-gray-600 dark:text-gray-300">{event.gate_number}</td>
                                    <td className="py-2 px-4">
                                        <button
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                            onClick={() => handleViewAttendees(event.event_id, event.quadrant_number, event.gate_number)}
                                        >
                                            View Attendees
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {selectedEventAttendees.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
                            <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                                Attendees for Event ID: {selectedEventId}
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Total Participants: {
                                    selectedEventAttendees.reduce(
                                        (total, attendee) => total + (attendee.number_of_attendees || 0),
                                        0
                                    )
                                }
                            </p>
                            <table className="min-w-full table-auto text-left border">
                                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
                                    <tr>
                                        <th className="py-2 px-4">Attendee ID</th>
                                        <th className="py-2 px-4">Number of Attendees</th>
                                        <th className="py-2 px-4">Admission Status</th>
                                        <th className="py-2 px-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedEventAttendees.map((attendee) => (
                                        <tr key={attendee.attendee_id} className="border-t">
                                            <td className="py-2 px-4 text-gray-900 dark:text-white">{attendee.attendee_id}</td>
                                            <td className="py-2 px-4 text-gray-700 dark:text-gray-300">{attendee.number_of_attendees}</td>
                                            <td className="py-2 px-4 text-gray-700 dark:text-gray-300">{attendee.admission_status == 0 ? "Not admitted" : "Admitted"}</td>
                                            <td className="py-2 px-4">
                                            <button
                                                className={`px-3 py-1 rounded ${
                                                    attendee.admission_status === 'Admitted'
                                                        ? 'bg-red-500 hover:bg-red-600'
                                                        : 'bg-green-500 hover:bg-green-600'
                                                } text-white`}
                                                onClick={() => handleAdmit(attendee.attendee_id)}
                                            >
                                                {attendee.admission_status === 0 ? 'Admit' : 'Unadmit'}
                                            </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}


                </div>
            )}
        </div>
    );
};

export default StaffDashboard;
