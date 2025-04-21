import React, { useState } from 'react';
//import { format } from 'date-fns'; // Removed - Not used

import API from '../../api';

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        eventName: '',
        eventDescription: '',
        eventDate: '',
        eventTime: '',
        eventLocation: '',
        adminId: '',
        seatingType: '',
        numberOfQuadrants: '',
        attendeesPerQuadrant: '',
        numberOfGatesPerQuadrant: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState('idle');
    const [submissionMessage, setSubmissionMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const handleDateChange = (e) => {
        const { value } = e.target;
        setFormData({ ...formData, eventDate: value });
        setErrors({ ...errors, eventDate: '' });
    };

    const handleSelectChange = (fieldName, selectedValue) => { // Added fieldName
        setFormData({ ...formData, [fieldName]: selectedValue });
        setErrors({ ...errors, [fieldName]: '' });
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        if (!formData.eventName.trim()) {
            newErrors.eventName = 'Event name is required';
            isValid = false;
        }
        if (!formData.eventDescription.trim()) {
            newErrors.eventDescription = 'Event description is required';
            isValid = false;
        }
        if (!formData.eventDate) {
            newErrors.eventDate = 'Event date is required';
            isValid = false;
        }
        if (!formData.eventTime.trim()) {
            newErrors.eventTime = 'Event time is required';
            isValid = false;
        }
        if (!formData.eventLocation.trim()) {
            newErrors.eventLocation = 'Event location is required';
            isValid = false;
        }
        if (!formData.adminId.trim()) {
            newErrors.adminId = 'Admin ID is required';
            isValid = false;
        }
        if (!formData.seatingType) {
            newErrors.seatingType = 'Seating type is required';
            isValid = false;
        }
        if (!formData.numberOfQuadrants.trim() || isNaN(Number(formData.numberOfQuadrants)) || Number(formData.numberOfQuadrants) <= 0) {
            newErrors.numberOfQuadrants = 'Number > 0';
            isValid = false;
        }
        if (!formData.attendeesPerQuadrant.trim() || isNaN(Number(formData.attendeesPerQuadrant)) || Number(formData.attendeesPerQuadrant) <= 0) {
            newErrors.attendeesPerQuadrant = 'Number > 0';
            isValid = false;
        }
        if (!formData.numberOfGatesPerQuadrant.trim() || isNaN(Number(formData.numberOfGatesPerQuadrant)) || Number(formData.numberOfGatesPerQuadrant) <= 0) {
            newErrors.numberOfGatesPerQuadrant = 'Number > 0';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmissionStatus('idle');
        setSubmissionMessage('');

        try {
            const endpoint = '/events/createEvent';
            const response = await API.post(endpoint, formData);

            if (response.status === 201) {
                setSubmissionStatus('success');
                setSubmissionMessage('Event created successfully!');
                setFormData({
                    eventName: '',
                    eventDescription: '',
                    eventDate: '',
                    eventTime: '',
                    eventLocation: '',
                    adminId: '',
                    seatingType: '',
                    numberOfQuadrants: '',
                    attendeesPerQuadrant: '',
                    numberOfGatesPerQuadrant: '',
                });
            } else {
                setSubmissionStatus('error');
                setSubmissionMessage(response.data.message || 'Failed to create event. Please try again.');
            }
        } catch (error) {
            setSubmissionStatus('error');
            setSubmissionMessage(error.response?.data?.message || 'An error occurred. Please check your network connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create Event
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Fill out the form below to create a new event.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">Event Name</label>
                            <input
                                id="eventName"
                                name="eventName"
                                type="text"
                                value={formData.eventName}
                                onChange={handleChange}
                                required
                                placeholder="Event Name"
                                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.eventName ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors.eventName && (
                                <p className="mt-1 text-sm text-red-600" id="eventName-error">{errors.eventName}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="eventDescription" className="block text-sm font-medium text-gray-700">Event Description</label>
                            <textarea
                                id="eventDescription"
                                name="eventDescription"
                                value={formData.eventDescription}
                                onChange={handleChange}
                                required
                                placeholder="Event Description"
                                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[100px] resize-y ${errors.eventDescription ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors.eventDescription && (
                                <p className="mt-1 text-sm text-red-600" id="eventDescription-error">{errors.eventDescription}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">Event Date</label>
                            <input
                                id="eventDate"
                                name="eventDate"
                                type="date"
                                value={formData.eventDate}
                                onChange={handleDateChange}
                                required
                                placeholder="Event Date"
                                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.eventDate ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors.eventDate && (
                                <p className="mt-1 text-sm text-red-600" id="eventDate-error">{errors.eventDate}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="eventTime" className="block text-sm font-medium text-gray-700">Event Time</label>
                            <input
                                id="eventTime"
                                name="eventTime"
                                type="time"
                                value={formData.eventTime}
                                onChange={handleChange}
                                required
                                placeholder="Event Time"
                                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.eventTime ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors.eventTime && (
                                <p className="mt-1 text-sm text-red-600" id="eventTime-error">{errors.eventTime}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="eventLocation" className="block text-sm font-medium text-gray-700">Event Location</label>
                            <input
                                id="eventLocation"
                                name="eventLocation"
                                type="text"
                                value={formData.eventLocation}
                                onChange={handleChange}
                                required
                                placeholder="Event Location"
                                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.eventLocation ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors.eventLocation && (
                                <p className="mt-1 text-sm text-red-600" id="eventLocation-error">{errors.eventLocation}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="adminId" className="block text-sm font-medium text-gray-700">Admin ID</label>
                            <input
                                id="adminId"
                                name="adminId"
                                type="text"
                                value={formData.adminId}
                                onChange={handleChange}
                                required
                                placeholder="Admin ID"
                                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.adminId ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors.adminId && (
                                <p className="mt-1 text-sm text-red-600" id="adminId-error">{errors.adminId}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="seatingType" className="block text-sm font-medium text-gray-700">Seating Type</label>
                            <select
                                id="seatingType"
                                name="seatingType"
                                value={formData.seatingType}
                                onChange={(e) => handleSelectChange('seatingType', e.target.value)}
                                required
                                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.seatingType ? "border-red-500" : "border-gray-300"}`}
                            >
                                <option value="">Select Seating Type</option>
                                <option value="fixed">Fixed</option>
                                <option value="dynamic">Dynamic</option>
                            </select>
                            {errors.seatingType && (
                                <p className="mt-1 text-sm text-red-600" id="seatingType-error">{errors.seatingType}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="numberOfQuadrants" className="block text-sm font-medium text-gray-700">Number of Quadrants</label>
                            <input
                                id="numberOfQuadrants"
                                name="numberOfQuadrants"
                                type="number"
                                value={formData.numberOfQuadrants}
                                onChange={handleChange}
                                required
                                placeholder="Number of Quadrants"
                                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.numberOfQuadrants ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors.numberOfQuadrants && (
                                <p className="mt-1 text-sm text-red-600" id="numberOfQuadrants-error">{errors.numberOfQuadrants}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="attendeesPerQuadrant" className="block text-sm font-medium text-gray-700">Attendees per Quadrant</label>
                            <input
                                id="attendeesPerQuadrant"
                                name="attendeesPerQuadrant"
                                type="number"
                                value={formData.attendeesPerQuadrant}
                                onChange={handleChange}
                                required
                                placeholder="Attendees per Quadrant"
                                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.attendeesPerQuadrant ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors.attendeesPerQuadrant && (
                                <p className="mt-1 text-sm text-red-600" id="attendeesPerQuadrant-error">{errors.attendeesPerQuadrant}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="numberOfGatesPerQuadrant" className="block text-sm font-medium text-gray-700">Number of Gates per Quadrant</label>
                            <input
                                id="numberOfGatesPerQuadrant"
                                name="numberOfGatesPerQuadrant"
                                type="number"
                                value={formData.numberOfGatesPerQuadrant}
                                onChange={handleChange}
                                required
                                placeholder="Number of Gates per Quadrant"
                                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.numberOfGatesPerQuadrant ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors.numberOfGatesPerQuadrant && (
                                <p className="mt-1 text-sm text-red-600" id="numberOfGatesPerQuadrant-error">{errors.numberOfGatesPerQuadrant}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        <div className="text-sm">

                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-2 px-4 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
                        >
                            {isSubmitting ? 'Creating Event...' : 'Create Event'}
                        </button>
                    </div>
                    {submissionStatus === 'success' && (
                        <div className="mt-4 text-center text-green-600 ">
                            <span>{submissionMessage}</span>
                        </div>
                    )}
                    {submissionStatus === 'error' && (
                        <div className="mt-4 text-center text-red-600">
                            <span>{submissionMessage}</span>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CreateEvent;
