import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * PrivateRoute component to protect routes that require authentication
 * @param {Object} props - Component props
 * @param {Object} props.user - Current user object
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @returns {React.ReactElement} - Rendered component
 */
const PrivateRoute = ({ user, children }) => {
  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  // Render children if authenticated
  return children;
};

export default PrivateRoute;
