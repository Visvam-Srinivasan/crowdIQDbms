import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/authentication/Login';
import SignUp from './components/authentication/SignUp';
import Home from './components/Home';
import AdminDashboard from './components/admin/AdminDashboard';
import StaffDashboard from './components/staff/StaffDashboard';
import AttendeeDashboard from './components/attendee/StaffDashboard';
import { AssignStaffToGates, CreateEvent } from './components/admin/CreateEvent';

function App() {

  return (
    <Router>
      <Navbar /> 
      <div className="min-h-screen bg-gray-100"> {/* Adding a wrapper for the page content */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/createEvent" element={<CreateEvent />} />
          <Route path="/admin/assignStaff/:eventId" element={<AssignStaffToGates />} />
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/attendee/dashboard" element={<AttendeeDashboard />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
