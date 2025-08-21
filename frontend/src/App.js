import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import 'leaflet/dist/leaflet.css';

// Import Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/auth/ProtectedRoute'; 

// Import Pages
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage'; 
import ProfilePage from './pages/ProfilePage';
import ThreatRadarPage from './pages/ThreatRadarPage';
import SubmitReportPage from './pages/SubmitReportPage'; // This import is likely already here
import DataFeedPage from './pages/DataFeedPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={ <ProtectedRoute> <DashboardPage /> </ProtectedRoute> }
          />
          <Route
            path="/profile"
            element={ <ProtectedRoute> <ProfilePage /> </ProtectedRoute> }
          />
          <Route
            path="/threat-radar"
            element={ <ProtectedRoute> <ThreatRadarPage /> </ProtectedRoute> }
          />

          {/* THIS IS THE MISSING PART 👇 */}
          <Route
            path="/submit-report"
            element={
              <ProtectedRoute>
                <SubmitReportPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/data-feed"
            element={
              <ProtectedRoute>
                <DataFeedPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;