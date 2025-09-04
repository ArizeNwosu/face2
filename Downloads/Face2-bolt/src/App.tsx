import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import Generate from './pages/generate/Generate';
import Documentation from './pages/Documentation';
import Api from './pages/Api';
import Support from './pages/Support';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import HipaaCompliance from './pages/HipaaCompliance';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/generate" 
              element={
                <ProtectedRoute requiresSubscription={false}>
                  <Generate />
                </ProtectedRoute>
              } 
            />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/api" element={<Api />} />
            <Route path="/support" element={<Support />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/hipaa-compliance" element={<HipaaCompliance />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;