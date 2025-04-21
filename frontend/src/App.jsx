import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/authentication/Login';
import SignUp from './components/authentication/SignUp';
import Home from './components/Home';

function App() {
  const [role, setRole] = React.useState('staff'); // hardcoded for now or use from login logic

  return (
    <Router>
      <Navbar role={role} onLogout={() => setRole('')} /> {/* Navbar is displayed at the top */}
      <div className="min-h-screen bg-gray-100"> {/* Adding a wrapper for the page content */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
