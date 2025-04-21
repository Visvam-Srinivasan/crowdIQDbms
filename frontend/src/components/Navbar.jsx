import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ role = '', onLogout }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };
  const handleSingin = () => {
    navigate('/signup');
  };
  const handleHomeClick = () => {
    navigate('/');
  };


  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold" onClick={handleHomeClick}>Crowd Manager</h1>
      <div className="space-x-4">
        <button onClick={handleLogin} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">Login</button>
        <button onClick={handleSingin} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">Signup</button>
      </div>
    </nav>
  );
}

export default Navbar;
