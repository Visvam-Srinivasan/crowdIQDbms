import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const AttendeeDashboard = () => {
    const navigate = useNavigate();
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">AttendeeDashboard</h2>
      </section>
    </div>
  );
};

export default AttendeeDashboard;


