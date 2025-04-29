import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase-config';
import { doc, getDoc } from '@firebase/firestore';
import './Dashboard.css';

/**
 * Dashboard page component
 * @returns {React.ReactElement} - Rendered component
 */
const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    extractionsToday: 0,
    totalExtractions: 0,
    savedTemplates: 0,
    activeMonitors: 0
  });

  // Recent extractions (mock data)
  const recentExtractions = [
    {
      id: 'ext1',
      name: 'Product Prices',
      website: 'example.com',
      date: '2025-04-15',
      status: 'completed',
      records: 128
    },
    {
      id: 'ext2',
      name: 'News Articles',
      website: 'newssite.com',
      date: '2025-04-14',
      status: 'completed',
      records: 42
    },
    {
      id: 'ext3',
      name: 'Social Media Profiles',
      website: 'socialnetwork.com',
      date: '2025-04-13',
      status: 'failed',
      records: 0
    }
  ];

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          setUser(currentUser);
          
          // Fetch user profile from Firestore
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          }
          
          // In a real app, you would fetch actual stats from Firestore
          // For now, we'll use mock data
          setStats({
            extractionsToday: 3,
            totalExtractions: 42,
            savedTemplates: 7,
            activeMonitors: 5
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <section className="welcome-section">
        <div className="welcome-content">
          <h1 className="welcome-title">
            Welcome, {user?.displayName || 'User'}!
          </h1>
          <p className="welcome-subtitle">
            Here's an overview of your data extraction activities
          </p>
        </div>
        <div className="welcome-actions">
          <Link to="/extractor" className="btn btn-primary">
            New Extraction
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
              </svg>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.extractionsToday}</h3>
              <p className="stat-label">Extractions Today</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.totalExtractions}</h3>
              <p className="stat-label">Total Extractions</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.savedTemplates}</h3>
              <p className="stat-label">Saved Templates</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"></path>
                <path d="M12 12v.01"></path>
                <path d="M8 12v.01"></path>
                <path d="M16 12v.01"></path>
              </svg>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.activeMonitors}</h3>
              <p className="stat-label">Active Monitors</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Extractions Section */}
      <section className="recent-section">
        <div className="section-header">
          <h2 className="section-title">Recent Extractions</h2>
          <Link to="/extractions" className="view-all-link">
            View All
          </Link>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Website</th>
                <th>Date</th>
                <th>Status</th>
                <th>Records</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentExtractions.map((extraction) => (
                <tr key={extraction.id}>
                  <td>{extraction.name}</td>
                  <td>{extraction.website}</td>
                  <td>{extraction.date}</td>
                  <td>
                    <span className={`status-badge status-${extraction.status}`}>
                      {extraction.status}
                    </span>
                  </td>
                  <td>{extraction.records}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn view-btn" title="View">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                      <button className="action-btn edit-btn" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button className="action-btn delete-btn" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="quick-actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          <Link to="/extractor" className="quick-action-card">
            <div className="quick-action-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
              </svg>
            </div>
            <h3 className="quick-action-title">New Extraction</h3>
            <p className="quick-action-description">
              Extract data from any website using our visual selector
            </p>
          </Link>

          <Link to="/templates" className="quick-action-card">
            <div className="quick-action-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
            </div>
            <h3 className="quick-action-title">Browse Templates</h3>
            <p className="quick-action-description">
              Use pre-built templates or create your own
            </p>
          </Link>

          <Link to="/insights" className="quick-action-card">
            <div className="quick-action-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.29 7 12 12 20.71 7"></polyline>
                <line x1="12" y1="22" x2="12" y2="12"></line>
              </svg>
            </div>
            <h3 className="quick-action-title">View Insights</h3>
            <p className="quick-action-description">
              Get AI-powered insights from your extracted data
            </p>
          </Link>

          <Link to="/account" className="quick-action-card">
            <div className="quick-action-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h3 className="quick-action-title">Account Settings</h3>
            <p className="quick-action-description">
              Manage your account and subscription
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
