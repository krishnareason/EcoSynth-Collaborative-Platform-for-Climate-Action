import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { currentUser, currentUserData, logout } = useAuth();
  const navigate = useNavigate();

  // STYLES (now being used below)
  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#2c3e50',
    color: 'white',
  };

  const navLinksStyle = {
    listStyle: 'none',
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
  };
  
  const brandStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  };
  
  const buttonStyle = {
    ...linkStyle,
    backgroundColor: 'transparent',
    border: '1px solid white',
    padding: '8px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
  };
  
  const welcomeStyle = {
    color: '#ecf0f1',
    marginRight: '15px',
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={{ ...linkStyle, ...brandStyle }}>
        EcoSynth
      </Link>
      <ul style={navLinksStyle}>
        {currentUser ? (
          <>
            <li style={welcomeStyle}>Welcome, {currentUserData?.name || currentUser.email}</li>
            <li><Link to="/dashboard" style={linkStyle}>Dashboard</Link></li>
            <li><Link to="/threat-radar" style={linkStyle}>Threat Radar</Link></li>
            <li><Link to="/submit-report" style={linkStyle}>Submit Report</Link></li>
            <li><Link to="/data-feed" style={linkStyle}>Data Feed</Link></li>
            <li><Link to="/profile" style={linkStyle}>Profile</Link></li>
            <li><button onClick={handleLogout} style={buttonStyle}>Log Out</button></li>
          </>
        ) : (
          <>
            <li><Link to="/signup" style={linkStyle}>Sign Up</Link></li>
            <li><Link to="/login" style={linkStyle}>Log In</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}