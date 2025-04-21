import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import API from '../../api';

function SignUp() {
    const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);


  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setFormData({}); // reset form on role switch
    setMessage('');
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
      role: selectedRole // Include the selected role in formData
    }));
  };

  const handleLogin = () => {
    navigate('/login');

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !selectedRole) {
      setMessage('Email, password, and role are required');
      return;
    }
    try {
      const endpoint = `/signup/${selectedRole}`;
      const res = await API.post(endpoint, formData);
      setMessage(res.data.message || 'Registration successful! Login Now!');
      setSignUpSuccess(true);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Registration failed');
    }
  };

  const commonFields = (
    <>
      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        onChange={handleChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
      />
    </>
  );

  const renderForm = () => {
    if (!selectedRole) return null;

    return (
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        {commonFields}

        {selectedRole === 'attendee' && (
          <>
            <input
              type="text"
              name="ticketId"
              placeholder="Ticket ID"
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </>
        )}

        {selectedRole === 'staff' && (
          <>
            <input
              type="text"
              name="staffCode"
              placeholder="Staff Code"
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </>
        )}

        {selectedRole === 'admin' && (
          <>
            <input
              type="text"
              name="adminCode"
              placeholder="Admin Code"
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </>
        )}

        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:shadow-outline"
        >
          Register
        </button>
        {message && <p className="text-center mt-2 text-green-500">{message}</p>}
        {signUpSuccess &&         <button
          onClick={handleLogin}
          className="bg-green-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center transition-colors cursor-pointer"
        >
          Login
        </button>}

      </form>
    );
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Register</h2>

        <div className="space-y-4 mb-4">
          {['staff', 'admin', 'attendee'].map((role) => (
            <button
              key={role}
              className={`w-full py-2 rounded font-medium text-white transition-all duration-200 focus:outline-none focus:shadow-outline
                ${selectedRole === role
                  ? 'bg-indigo-700 border-4 border-indigo-300 shadow-lg scale-105'
                  : 'bg-indigo-500 hover:bg-indigo-600'
                }
              `}
              onClick={() => handleRoleSelection(role)}
            >
              {role === 'staff' ? 'Event Staff' : role === 'admin' ? 'Event Admin' : 'Attendee'}
            </button>
          ))}
        </div>

        {renderForm()}
      </div>
    </div>
  );
}

export default SignUp;