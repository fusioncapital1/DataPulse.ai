import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase-config';
import { signOut } from '@firebase/auth';
import './Navbar.css';

/**
 * Navigation bar component
 * @param {Object} props - Component props
 * @param {Object} props.user - Current user object
 * @returns {React.ReactElement} - Rendered component
 */
const Navbar = ({ user }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">DataPulse<span className="logo-accent">.ai</span></span>
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          <div className={menuOpen ? 'hamburger active' : 'hamburger'}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>

        <ul className={menuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
          </li>

          {user ? (
            <>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/extractor" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Extractor
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/templates" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Templates
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/insights" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Insights
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/account" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Account
                </Link>
              </li>
              <li className="nav-item">
                <button className="sign-out-btn" onClick={handleSignOut}>
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link sign-up-link" onClick={() => setMenuOpen(false)}>
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
