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
                <div className="overflow-x-auto bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <table className="min-w-full table-auto text-left border-collapse">
                        <thead className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white">
                            <tr>
                                <th className="py-2 px-4">Event Name</th>
                                <th className="py-2 px-4">Description</th>
                                <th className="py-2 px-4">Date</th>
                                <th className="py-2 px-4">Time</th>
                                <th className="py-2 px-4">Location</th>
                                <th className="py-2 px-4">Quadrant</th>
                                <th className="py-2 px-4">Gate</th>
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default StaffDashboard;
