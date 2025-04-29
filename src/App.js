import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase-config';
import { onAuthStateChanged } from '@firebase/auth';

// Import pages (to be created)
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Extractor from './pages/Extractor';
import Templates from './pages/Templates';
import Insights from './pages/Insights';
import Account from './pages/Account';
import Login from './pages/Login';
import Register from './pages/Register';

// Import components (to be created)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading DataPulse.ai...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <Navbar user={user} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <PrivateRoute user={user}>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/extractor" element={
              <PrivateRoute user={user}>
                <Extractor />
              </PrivateRoute>
            } />
            <Route path="/templates" element={
              <PrivateRoute user={user}>
                <Templates />
              </PrivateRoute>
            } />
            <Route path="/insights" element={
              <PrivateRoute user={user}>
                <Insights />
              </PrivateRoute>
            } />
            <Route path="/account" element={
              <PrivateRoute user={user}>
                <Account />
              </PrivateRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
