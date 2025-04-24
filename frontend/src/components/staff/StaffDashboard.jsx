import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';

const StaffDashboard = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const staffId = localStorage.getItem('userId');  // Assuming staff's user ID is stored in localStorage
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

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p>Loading assigned events...</p>
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
                <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">Staff Dashboard</h2>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Your Assigned Events</h3>
                </section>

            {events.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">You are not assigned to any events.</p>
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
                                <p className="text-gray-600 dark:text-gray-300 mb-1">Quadrant: {event.quadrant_number}</p>
                                <p className="text-gray-600 dark:text-gray-300 mb-1">Gate: {event.gate_number}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StaffDashboard;
