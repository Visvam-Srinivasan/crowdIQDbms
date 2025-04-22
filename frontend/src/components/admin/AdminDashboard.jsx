import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const adminId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchEvents = async () => {
            if (!adminId) {
                setError('Admin ID not found. Please log in.');
                setLoading(false);
                return;
            }

            try {
                const response = await API.get(`/events/admin/${adminId}`);
                if (response.status === 200) {
                    setEvents(response.data); // may be an empty array
                } else {
                    setError('Unexpected response status');
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch events.');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [adminId]);

    const handleCompleteEvent = async (eventId) => {
        try {
            const response = await API.post(`/events/${eventId}/complete`);
            if (response.status === 200) {
                // Refresh event list
                const updatedEvents = events.filter(event => event.event_id !== eventId);
                setEvents(updatedEvents);
            } else {
                setError('Failed to complete event.');
            }
        } catch (err) {
            setError(err.message || 'An error occurred while completing the event.');
        }
    };

    const handleViewStaff = async (eventId) => {
        try {
            const response = await API.get(`/events/staffAssignments/${eventId}`);
            setSelectedStaff(response.data);
            setShowModal(true);
        } catch (err) {
            setError('Failed to load staff assignments');
        }
    };
    
    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p>Loading events...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center text-red-600">
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <section className="text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-lg mb-8">
                <button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md shadow-md"
                    onClick={() => navigate('/admin/createEvent')}
                >
                    Create Event
                </button>
            </section>

            <h2 className="text-3xl font-semibold text-gray-900 dark:text-black mb-6 text-center">Admin Dashboard</h2>

            {events.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">No events found.</p>
                    <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md shadow-md"
                        onClick={() => navigate('/admin/createEvent')}
                    >
                        Add Event
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div key={event.event_id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{event.event_name}</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-1">Description: {event.event_description}</p>
                                <p className="text-gray-600 dark:text-gray-300 mb-1">Date: {event.event_date}</p>
                                <p className="text-gray-600 dark:text-gray-300 mb-1">Time: {event.event_time}</p>
                                <p className="text-gray-600 dark:text-gray-300 mb-1">Location: {event.event_location}</p>
                                <p className="text-gray-600 dark:text-gray-300 mb-1">Seating Type: {event.seating_type}</p>
                                <p className="text-gray-600 dark:text-gray-300 mb-1">Quadrants: {event.number_of_quadrants}</p>
                                <p className="text-gray-600 dark:text-gray-300 mb-1">Attendees/Quadrant: {event.attendees_per_quadrant}</p>
                                <p className="text-gray-600 dark:text-gray-300 mb-1">Gates/Quadrant: {event.number_of_gates_per_quadrant}</p>
                            </div>
                            <button
                                className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-md"
                                onClick={() => handleCompleteEvent(event.event_id)}
                            >
                                Complete Event
                            </button>
                            <button
                                className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md"
                                onClick={() => handleViewStaff(event.event_id)}
                            >
                                View Assigned Staff
                            </button>
                            {showModal && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                                        <h2 className="text-xl font-bold mb-4">Assigned Staff</h2>
                                        {selectedStaff.length === 0 ? (
                                            <p>No staff assigned yet.</p>
                                        ) : (
                                            <ul className="space-y-2">
                                                {selectedStaff.map((staff, index) => (
                                                    <li key={index} className="border p-2 rounded">
                                                        <p><strong>Staff ID:</strong> {staff.staff_id}</p>
                                                        <p><strong>Name:</strong> {staff.name || 'N/A'}</p>
                                                        <p><strong>Quadrant:</strong> {staff.quadrant_number}</p>
                                                        <p><strong>Gate:</strong> {staff.gate_number}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        <button
                                            className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
