import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api'; //  Ensure this is correctly configured

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const adminId = localStorage.getItem('userId'); // Get admin ID from localStorage

    useEffect(() => {
        const fetchEvents = async () => {
            if (!adminId) {
                setError('Admin ID not found. Please log in.');
                setLoading(false);
                return;
            }
            try {
                const response = await API.get(`/events/admin/${adminId}`); //  API endpoint
                if (response.status === 200) {
                    setEvents(response.data);
                } else if (response.status === 404) {
                    setEvents([]); // Set to empty array for no events
                }
                else {
                    setError('Failed to fetch events.');
                }
                setLoading(false);
            } catch (err) {
                setError(err.message || 'An error occurred while fetching events.');
                setLoading(false);
            }
        };

        fetchEvents();
    }, [adminId]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p>Loading events...</p> {/* Simple loading indicator */}
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

            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6 text-center">Admin Dashboard</h2>

            {events.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-300">No events found. Click &quot;Create Event&quot; to add events.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div key={event.event_id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{event.event_name}</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-1">Description: {event.event_description}</p>
                            <p className="text-gray-600 dark:text-gray-300 mb-1">Date: {event.event_date}</p>
                            <p className="text-gray-600 dark:text-gray-300 mb-1">Time: {event.event_time}</p>
                            <p className="text-gray-600 dark:text-gray-300 mb-1">Location: {event.event_location}</p>
                            <p className="text-gray-600 dark:text-gray-300 mb-1">Admin ID: {event.admin_id}</p>
                            <p className="text-gray-600 dark:text-gray-300 mb-1">Seating Type: {event.seating_type}</p>
                            <p className="text-gray-600 dark:text-gray-300 mb-1">Quadrants: {event.number_of_quadrants}</p>
                            <p className="text-gray-600 dark:text-gray-300 mb-1">Attendees/Quadrant: {event.attendees_per_quadrant}</p>
                            <p className="text-gray-600 dark:text-gray-300 mb-1">Gates/Quadrant: {event.number_of_gates_per_quadrant}</p>
                            {/* Add more fields as necessary */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
