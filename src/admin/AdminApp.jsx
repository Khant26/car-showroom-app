import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import './admin.css';

const FullScreenSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="admin-spinner"></div>
  </div>
);

// Only authenticated admins may see the dashboard.
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <FullScreenSpinner />;
  return user ? children : <Navigate to="/admin/login" replace />;
};

// Logged-in admins are sent straight to the dashboard.
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <FullScreenSpinner />;
  return user ? <Navigate to="/admin" replace /> : children;
};

// Mounted by the root router at /admin/*; all paths below are relative to /admin.
function AdminApp() {
  return (
    <AuthProvider>
      <div className="admin-root min-h-screen bg-gray-50 text-gray-900">
        <Routes>
          <Route
            path="login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default AdminApp;
