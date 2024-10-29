import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../data/Questscribe.png';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');  // Check if the token exists in localStorage

  const handleLogout = () => {
    localStorage.removeItem('token');  // Remove the token from localStorage
    navigate('/');  // Redirect to the home page after logging out
  };

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={logo} alt="QuestScribe Logo" className="logo" />
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        {!isAuthenticated && <li><Link to="/login">Login</Link></li>}
        {!isAuthenticated && <li><Link to="/signup">Sign Up</Link></li>}
        {isAuthenticated && <li><Link to="/journals/new">New Journal</Link></li>}
        {isAuthenticated && <li><Link to="/journals">Journals</Link></li>}
        {isAuthenticated && <li><Link to="/users">Users</Link></li>} {/* Add Users link */}
        {isAuthenticated && <li><Link to="/profile">Profile</Link></li>}
        {isAuthenticated && <li><Link to="/notifications">Notifications</Link></li>} {/* Add Notifications link */}
        {isAuthenticated && <li><Link className="logout-button" onClick={handleLogout}>Logout</Link></li>}
      </ul>
    </nav>
  );
};

export default Navbar;
