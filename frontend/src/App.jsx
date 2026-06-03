import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'

// Components
import Navbar from './components/Navbar'
import Toast from './components/Toast'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CandidateDashboard from './pages/CandidateDashboard'
import RecruiterDashboard from './pages/RecruiterDashboard'
import JobListingPage from './pages/JobListingPage'
import JobDetailPage from './pages/JobDetailPage'
import ProfilePage from './pages/ProfilePage'
import ApplicationsPage from './pages/ApplicationsPage'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <div className="min-h-screen bg-neutral-50 text-neutral-900 transition-colors duration-200 dark:bg-[#0A0A0C] dark:text-neutral-100 flex flex-col">
              <Navbar />
              
              <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/jobs" element={<JobListingPage />} />
                  <Route path="/jobs/:id" element={<JobDetailPage />} />
                  
                  {/* Protected Candidate Routes */}
                  <Route
                    path="/candidate-dashboard"
                    element={
                      <ProtectedRoute allowedRole="candidate">
                        <CandidateDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/applications"
                    element={
                      <ProtectedRoute allowedRole="candidate">
                        <ApplicationsPage />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Protected Recruiter Routes */}
                  <Route
                    path="/recruiter-dashboard"
                    element={
                      <ProtectedRoute allowedRole="recruiter">
                        <RecruiterDashboard />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Protected Profile settings */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Catch-all Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              <Toast />
            </div>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
