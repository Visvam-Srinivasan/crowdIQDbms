import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';

function Login() {
  const [selectedRole, setSelectedRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setMessage('');
  };

  const handleLogin = async () => {
    if (!selectedRole) {
      setMessage('Please select a role');
      return;
    }
    if (!email || !password) {
      setMessage('Please enter email and password');
      return;
    }

    try {
      const res = await API.post('/login', {
        role: selectedRole,
        email,
        password,
      });

      setMessage(res.data.message || 'Login successful');
      const { id, name } = res.data.user;
      localStorage.setItem('userId', id);
      localStorage.setItem('userName', name);
      localStorage.setItem('userRole', selectedRole); // Store the selected role!
      navigate(`/${selectedRole}/dashboard`);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

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

        {selectedRole && (
          <div className="space-y-4">
            <input
              type="email"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-indigo-500"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-indigo-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleLogin(); // 👉 Login on Enter key press
              }}
            />
            <button
              onClick={handleLogin}
              className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
            {message && <p className="text-center mt-2 text-green-500">{message}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;