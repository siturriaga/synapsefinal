// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 
import { AuthProvider, useAuth } from './contexts/AuthContext'; 
import { useSynapseData } from './hooks/useSynapseData'; 

// Page Imports (Using absolute paths for congruence)
import Dashboard from '@/pages/Dashboard.jsx'; 
import RosterPage from '@/pages/RosterPage.jsx'; 
import AssignmentsPage from '@/pages/AssignmentsPage.jsx';
import SettingsPage from '@/pages/SettingsPage.jsx'; 

// CRITICAL FIX: We are now ONLY importing the component from its external file.
import { AppHeader } from '@/components/common/AppHeader.jsx'; 

const queryClient = new QueryClient();

// Component for the Login Flow
const LoginPage = () => {
    const { loginWithGoogle } = useAuth();
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="p-8 text-center bg-white shadow-lg rounded">
                <h1 className="text-2xl font-bold mb-4">Synapse Co-Pilot Login</h1>
                <p className="mb-6">Please sign in to access your teacher tools.</p>
                <button onClick={loginWithGoogle} className="btn btn-primary bg-blue-600 hover:bg-blue-700 p-3 rounded text-white">
                    Sign In with Google
                </button>
            </div>
        </div>
    );
}

const AppRoutes = () => {
  const { user, loading: authLoading } = useAuth();
  const { loading: dataLoading } = useSynapseData();

  if (authLoading || dataLoading) return <div id="loading-overlay">Initializing Synapse Co-Pilot...</div>;

  // If user is NOT logged in, redirect to login
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }
  
  // If user IS logged in, show AppHeader and protected routes
  return (
    <div className="min-h-screen">
      {/* 🚨 USAGE: Renders the imported AppHeader component */}
      <AppHeader /> 
      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/roster" element={<RosterPage />} />
          <Route path="/assignments" element={<AssignmentsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};


export default function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}
