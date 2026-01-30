import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Lazy-loaded pages
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const FireIncidentSimulator = lazy(() => import('./pages/FireIncidentSimulator'));
const Analytics = lazy(() => import('./pages/Analytics'));
const LiveFeed = lazy(() => import('./pages/LiveFeed'));
const Map = lazy(() => import('./pages/Map'));
const SocialFeed = lazy(() => import('./pages/SocialFeed'));

// Auth wrapper
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  return token ? children : <Navigate to="/" replace />;
};

export default function App() {
  return (
    <Router>
      <Suspense fallback={<div className="text-center text-xl mt-20 text-blue-700 animate-pulse">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/incidents" element={<PrivateRoute><FireIncidentSimulator /></PrivateRoute>} />
          <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
          <Route path="/live" element={<PrivateRoute><LiveFeed /></PrivateRoute>} />
          <Route path="/map" element={<PrivateRoute><Map /></PrivateRoute>} />
          <Route path="/social" element={<PrivateRoute><SocialFeed /></PrivateRoute>} />
        </Routes>
      </Suspense>
    </Router>
  );
}
