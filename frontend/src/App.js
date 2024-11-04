import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';

const App = () => {
  const isAuthenticated = () => {
    return !!localStorage.getItem('accessToken');
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={isAuthenticated() ? <AdminDashboard /> : <Navigate to="/admin-login" />}
          />

          {/* User routes */}
          <Route
            path="/user"
            element={isAuthenticated() ? <UserDashboard /> : <Navigate to="/login" />}
          />

          {/* Redirect any unknown routes to home page */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
