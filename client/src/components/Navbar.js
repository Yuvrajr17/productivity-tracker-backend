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
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          🚀 Productivity Tracker
        </Link>

        <ul className="navbar-links">
          <li>
            <Link to="/dashboard" className="nav-link">
              <span className="nav-icon">📊</span>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/tasks" className="nav-link">
              <span className="nav-icon">✅</span>
              Tasks
            </Link>
          </li>
          <li>
            <Link to="/analytics" className="nav-link">
              <span className="nav-icon">📈</span>
              Analytics
            </Link>
          </li>
          <li>
            <Link to="/leaderboard" className="nav-link">
              <span className="nav-icon">🏆</span>
              Leaderboard
            </Link>
          </li>
        </ul>

        <div className="navbar-user">
          <span className="navbar-username">{user.username}</span>
          <button className="navbar-logout" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
