import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/dashboard" className="navbar-brand">
          🚀 Productivity Tracker
        </Link>

        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
          <Link to="/tasks" className="nav-link">
            Tasks
          </Link>
          <Link to="/analytics" className="nav-link">
            Analytics
          </Link>
          <Link to="/leaderboard" className="nav-link">
            Leaderboard
          </Link>
        </div>

        <div className="nav-user">
          <span className="username">{user.username}</span>
          <button className="btn btn-secondary btn-small" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
