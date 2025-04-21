import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-900 mb-4">
          Manage Events, Effortlessly.
        </h1>
        <p className="text-lg text-gray-800 dark:text-gray-800">
          Your all-in-one solution for seamless event management and crowd control.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-black text-center mb-8">
          User Roles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Event Staff</h3>
            <p className="text-white dark:text-white mb-4">
              On-the-ground support for smooth event execution.
            </p>
            <ul className="list-disc list-inside space-y-2 text-white dark:text-white">
              <li>Check-in attendees</li>
              <li>Manage crowd flow</li>
              <li>Handle on-site issues</li>
              <li>Communicate with admin</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Event Admin</h3>
            <p className="text-white dark:text-white mb-4">
              Oversee and manage all aspects of the event.
            </p>
            <ul className="list-disc list-inside space-y-2 text-white dark:text-white">
              <li>Create and manage events</li>
              <li>Assign staff roles</li>
              <li>Monitor event progress</li>
              <li>Generate reports</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Attendee</h3>
            <p className="text-white dark:text-white mb-4">
              Experience the event and engage with the community.
            </p>
            <ul className="list-disc list-inside space-y-2 text-white dark:text-white">
              <li>Register for events</li>
              <li>Access event information</li>
              <li>Participate in activities</li>
              <li>Enjoy the experience</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">Ready to Get Started?</h2>
        <p className="text-lg text-gray-800 dark:text-gray-200 mb-6">
          Join us today and experience the future of event management.
        </p>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md shadow-md"
            onClick={() => navigate("/signup")}
        >
          Sign Up Now
        </button>
      </section>
    </div>
  );
};

export default Home;


