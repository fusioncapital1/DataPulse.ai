import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase-config';
import { doc, getDoc, updateDoc } from '@firebase/firestore';
import AuthService from '../services/auth-service';
import ApiService from '../services/api-service';
import { formatDate } from '../utils/helpers';
import './Account.css';

/**
 * Account page component
 * @returns {React.ReactElement} - Rendered component
 */
const Account = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    displayName: '',
    email: '',
    photoURL: ''
  });
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'subscription', 'security'
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Usage stats
  const [usageStats, setUsageStats] = useState({
    extractionsToday: 0,
    totalExtractions: 0,
    savedTemplates: 0,
    creditsUsed: 0,
    creditsRemaining: 0
  });

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError('');
      
      try {
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          throw new Error('You must be logged in to view your account');
        }
        
        setUser(currentUser);
        
        // Fetch user profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          setProfile({
            displayName: currentUser.displayName || '',
            email: currentUser.email || '',
            photoURL: currentUser.photoURL || ''
          });
          
          // Set usage stats
          setUsageStats({
            extractionsToday: userData.extractionsToday || 0,
            totalExtractions: userData.totalExtractions || 0,
            savedTemplates: userData.savedTemplates || 0,
            creditsUsed: userData.creditsUsed || 0,
            creditsRemaining: userData.credits || 0
          });
        }
        
        // Fetch subscription data
        try {
          const subscriptionData = await ApiService.getUserSubscription();
          setSubscription(subscriptionData);
        } catch (subscriptionError) {
          console.error('Fetch subscription error:', subscriptionError);
          // Set default subscription data for free tier
          setSubscription({
            plan: 'free',
            status: 'active',
            renewalDate: null,
            price: 0
          });
        }
      } catch (error) {
        console.error('Fetch user data error:', error);
        setError('Failed to fetch user data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    setUpdateLoading(true);
    setUpdateError('');
    setUpdateSuccess('');
    
    try {
      // Update profile in Firebase Auth and Firestore
      await AuthService.updateUserProfile({
        displayName: profile.displayName,
        photoURL: profile.photoURL
      });
      
      setUpdateSuccess('Profile updated successfully');
    } catch (error) {
      console.error('Update profile error:', error);
      setUpdateError('Failed to update profile: ' + error.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      setUpdateError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setUpdateError('Password must be at least 6 characters');
      return;
    }
    
    setUpdateLoading(true);
    setUpdateError('');
    setUpdateSuccess('');
    
    try {
      // Update password
      await AuthService.updateUserPassword(currentPassword, newPassword);
      
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setUpdateSuccess('Password updated successfully');
    } catch (error) {
      console.error('Update password error:', error);
      setUpdateError('Failed to update password: ' + error.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  // Handle subscription upgrade
  const handleUpgradeSubscription = async (planId) => {
    setUpdateLoading(true);
    setUpdateError('');
    
    try {
      // Create checkout session
      const session = await ApiService.createCheckoutSession(planId);
      
      // Redirect to checkout page
      window.location.href = session.url;
    } catch (error) {
      console.error('Upgrade subscription error:', error);
      setUpdateError('Failed to upgrade subscription: ' + error.message);
      setUpdateLoading(false);
    }
  };

  // Handle subscription cancellation
  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      return;
    }
    
    setUpdateLoading(true);
    setUpdateError('');
    
    try {
      // Cancel subscription
      await ApiService.cancelSubscription();
      
      // Update subscription state
      setSubscription({
        ...subscription,
        status: 'canceled'
      });
      
      setUpdateSuccess('Subscription canceled successfully');
    } catch (error) {
      console.error('Cancel subscription error:', error);
      setUpdateError('Failed to cancel subscription: ' + error.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  // Get plan details
  const getPlanDetails = () => {
    switch (subscription?.plan) {
      case 'free':
        return {
          name: 'Free Plan',
          price: '$0/month',
          features: [
            '5 extractions per day',
            'Basic data monitoring',
            'Export to CSV',
            'Community templates',
            'Email support'
          ]
        };
      case 'pro':
        return {
          name: 'Professional Plan',
          price: '$29/month',
          features: [
            'Unlimited extractions',
            'Advanced monitoring',
            'Export to multiple formats',
            'AI-powered insights',
            'API access',
            'Priority support'
          ]
        };
      case 'enterprise':
        return {
          name: 'Enterprise Plan',
          price: '$99/month',
          features: [
            'Everything in Professional',
            'Dedicated server resources',
            'Custom integrations',
            'Team collaboration',
            'Advanced security features',
            'Dedicated account manager'
          ]
        };
      default:
        return {
          name: 'Unknown Plan',
          price: 'Unknown',
          features: []
        };
    }
  };

  const planDetails = getPlanDetails();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading account information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="account-container">
      <div className="account-header">
        <h1 className="account-title">Account Settings</h1>
        <p className="account-subtitle">
          Manage your profile, subscription, and security settings
        </p>
      </div>

      <div className="account-content">
        <div className="account-sidebar">
          <div className="user-info">
            <div className="user-avatar">
              {profile.photoURL ? (
                <img src={profile.photoURL} alt={profile.displayName} />
              ) : (
                <div className="avatar-placeholder">
                  {profile.displayName ? profile.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
            <div className="user-details">
              <h3 className="user-name">{profile.displayName || 'User'}</h3>
              <p className="user-email">{profile.email}</p>
            </div>
          </div>

          <div className="account-tabs">
            <button
              className={`account-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Profile
            </button>
            <button
              className={`account-tab ${activeTab === 'subscription' ? 'active' : ''}`}
              onClick={() => setActiveTab('subscription')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
              Subscription
            </button>
            <button
              className={`account-tab ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Security
            </button>
            <button
              className={`account-tab ${activeTab === 'usage' ? 'active' : ''}`}
              onClick={() => setActiveTab('usage')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20V10"></path>
                <path d="M18 20V4"></path>
                <path d="M6 20v-4"></path>
              </svg>
              Usage
            </button>
          </div>
        </div>

        <div className="account-main">
          {activeTab === 'profile' && (
            <div className="account-section">
              <h2 className="section-title">Profile Information</h2>
              
              {updateSuccess && <div className="success-message">{updateSuccess}</div>}
              {updateError && <div className="error-message">{updateError}</div>}
              
              <form onSubmit={handleProfileUpdate} className="profile-form">
                <div className="form-group">
                  <label htmlFor="displayName">Full Name</label>
                  <input
                    type="text"
                    id="displayName"
                    value={profile.displayName}
                    onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={profile.email}
                    disabled
                    className="disabled-input"
                  />
                  <p className="input-help">
                    Email address cannot be changed. Please contact support if you need to update your email.
                  </p>
                </div>
                
                <div className="form-group">
                  <label htmlFor="photoURL">Profile Picture URL</label>
                  <input
                    type="url"
                    id="photoURL"
                    value={profile.photoURL}
                    onChange={(e) => setProfile({ ...profile, photoURL: e.target.value })}
                    placeholder="Enter URL for your profile picture"
                  />
                </div>
                
                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={updateLoading}
                  >
                    {updateLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="account-section">
              <h2 className="section-title">Subscription</h2>
              
              {updateSuccess && <div className="success-message">{updateSuccess}</div>}
              {updateError && <div className="error-message">{updateError}</div>}
              
              <div className="current-plan">
                <div className="plan-header">
                  <h3>Current Plan</h3>
                  <span className={`plan-status ${subscription?.status}`}>
                    {subscription?.status}
                  </span>
                </div>
                
                <div className="plan-details">
                  <div className="plan-name">{planDetails.name}</div>
                  <div className="plan-price">{planDetails.price}</div>
                  
                  {subscription?.renewalDate && (
                    <div className="renewal-date">
                      Next billing date: {formatDate(subscription.renewalDate)}
                    </div>
                  )}
                  
                  <ul className="plan-features">
                    {planDetails.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                
                {subscription?.plan === 'free' ? (
                  <div className="upgrade-options">
                    <h4>Upgrade Your Plan</h4>
                    <div className="upgrade-buttons">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleUpgradeSubscription('pro')}
                        disabled={updateLoading}
                      >
                        Upgrade to Professional
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleUpgradeSubscription('enterprise')}
                        disabled={updateLoading}
                      >
                        Upgrade to Enterprise
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="subscription-actions">
                    {subscription?.status === 'active' && (
                      <button
                        className="btn btn-danger"
                        onClick={handleCancelSubscription}
                        disabled={updateLoading}
                      >
                        Cancel Subscription
                      </button>
                    )}
                    
                    {subscription?.status === 'canceled' && (
                      <div className="reactivate-info">
                        <p>
                          Your subscription has been canceled and will end on {formatDate(subscription.renewalDate)}.
                        </p>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleUpgradeSubscription(subscription.plan)}
                          disabled={updateLoading}
                        >
                          Reactivate Subscription
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="account-section">
              <h2 className="section-title">Security</h2>
              
              {updateSuccess && <div className="success-message">{updateSuccess}</div>}
              {updateError && <div className="error-message">{updateError}</div>}
              
              <form onSubmit={handlePasswordChange} className="password-form">
                <h3>Change Password</h3>
                
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                
                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={updateLoading}
                  >
                    {updateLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
              
              <div className="security-options">
                <h3>Account Security</h3>
                
                <div className="security-option">
                  <div className="option-info">
                    <h4>Two-Factor Authentication</h4>
                    <p>Add an extra layer of security to your account</p>
                  </div>
                  <button className="btn btn-outline">Enable 2FA</button>
                </div>
                
                <div className="security-option">
                  <div className="option-info">
                    <h4>Active Sessions</h4>
                    <p>Manage devices where you're currently logged in</p>
                  </div>
                  <button className="btn btn-outline">View Sessions</button>
                </div>
                
                <div className="security-option">
                  <div className="option-info">
                    <h4>Account Activity</h4>
                    <p>View recent account activity and security events</p>
                  </div>
                  <button className="btn btn-outline">View Activity</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="account-section">
              <h2 className="section-title">Usage Statistics</h2>
              
              <div className="usage-stats">
                <div className="usage-stat">
                  <div className="stat-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{usageStats.extractionsToday}</div>
                    <div className="stat-label">Extractions Today</div>
                  </div>
                </div>
                
                <div className="usage-stat">
                  <div className="stat-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{usageStats.totalExtractions}</div>
                    <div className="stat-label">Total Extractions</div>
                  </div>
                </div>
                
                <div className="usage-stat">
                  <div className="stat-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{usageStats.savedTemplates}</div>
                    <div className="stat-label">Saved Templates</div>
                  </div>
                </div>
                
                <div className="usage-stat">
                  <div className="stat-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 6v6l4 2"></path>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{usageStats.creditsRemaining}</div>
                    <div className="stat-label">Credits Remaining</div>
                  </div>
                </div>
              </div>
              
              <div className="usage-history">
                <h3>Usage History</h3>
                <p className="coming-soon">
                  Detailed usage history and analytics coming soon.
                </p>
              </div>
              
              <div className="api-usage">
                <h3>API Usage</h3>
                {subscription?.plan === 'free' ? (
                  <div className="upgrade-prompt">
                    <p>
                      API access is available on Professional and Enterprise plans.
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setActiveTab('subscription');
                      }}
                    >
                      Upgrade Now
                    </button>
                  </div>
                ) : (
                  <div className="api-info">
                    <div className="api-key-section">
                      <h4>Your API Key</h4>
                      <div className="api-key-display">
                        <input
                          type="password"
                          value="••••••••••••••••••••••••••••••"
                          disabled
                          className="disabled-input"
                        />
                        <button className="btn btn-outline">Show</button>
                        <button className="btn btn-outline">Regenerate</button>
                      </div>
                    </div>
                    
                    <div className="api-docs-link">
                      <a href="/api-docs" className="btn btn-secondary">
                        View API Documentation
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
