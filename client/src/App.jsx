import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateFailure from './pages/CreateFailure';
import EditFailure from './pages/EditFailure';
import FailureDetails from './pages/FailureDetails';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-layout">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/failures/new"
                element={
                  <ProtectedRoute>
                    <CreateFailure />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/failures/:id"
                element={
                  <ProtectedRoute>
                    <FailureDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/failures/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditFailure />
                  </ProtectedRoute>
                }
              />

              {/* Redirect root to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
