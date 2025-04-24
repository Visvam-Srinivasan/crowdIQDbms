import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, LogIn, LogOut, PlusCircle } from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userId'));
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || ''); // Add state for userRole

  const handleLogin = () => {
    navigate('/login');
  };
  const handleSignup = () => {
    navigate('/signup');
  };
  const handleHomeClick = () => {
    navigate('/');
  };

  const handleDashboardClick = () => {
    const role = localStorage.getItem('userRole'); // Get role from localStorage
    if (role) {
      navigate(`/${role}/dashboard`); // Use the role to navigate
    } else {
      // Handle the case where userRole is not in localStorage (optional)
      console.error('User role not found in localStorage');
      //   You might want to redirect to a default dashboard or show an error message
      navigate('/'); // Or some other default route
    }
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setUserName('');
    setUserRole(''); // Clear userRole state
    navigate('/');
  };

  useEffect(() => {
    const handleStorageChange = (event) => {
      // Check if the change is related to user authentication
      if (event.key === 'userId' || event.key === 'userName' || event.key === 'userRole') {
        setIsLoggedIn(!!localStorage.getItem('userId'));
        setUserName(localStorage.getItem('userName') || '');
        setUserRole(localStorage.getItem('userRole') || '');
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Initial values on component mount
    setIsLoggedIn(!!localStorage.getItem('userId'));
    setUserName(localStorage.getItem('userName') || '');
    setUserRole(localStorage.getItem('userRole') || '');

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
      <h1
        className="text-xl font-bold flex items-center cursor-pointer hover:text-gray-300 transition-colors"
        onClick={handleHomeClick}
      >
        <Users className="mr-2 w-6 h-6" />
        EventIQ
        {isLoggedIn && (
          <span className="text-gray-300 ml-2">| Welcome, {userName || 'User'}</span>
        )}
      </h1>
      <div className="flex space-x-4 items-center">
        {isLoggedIn ? (
          <>
            <button
              onClick={handleDashboardClick}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded flex items-center transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogoutClick}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center transition-colors"
            >
              <LogOut className="mr-2 w-4 h-4" />
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleLogin}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded flex items-center transition-colors"
            >
              <LogIn className="mr-2 w-4 h-4" />
              Login
            </button>
            <button
              onClick={handleSignup}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center transition-colors"
            >
              <PlusCircle className="mr-2 w-4 h-4" />
              Signup
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
