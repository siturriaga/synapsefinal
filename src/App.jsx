// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// 🚨 FIX: Correctly import QueryClient and QueryClientProvider from TanStack Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useSynapseData } from './hooks/useSynapseData'; 

// Page Imports
import Dashboard from './pages/Dashboard';
import RosterPage from './pages/RosterPage'; 
import AssignmentsPage from './pages/AssignmentsPage';

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user, loading: authLoading } = useAuth();
  const { loading: dataLoading } = useSynapseData();

  if (authLoading || dataLoading) return <div id="loading-overlay">Initializing Synapse Co-Pilot...</div>;

  return (
    <Routes>
      <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/roster" element={user ? <RosterPage /> : <Navigate to="/login" />} />
      <Route path="/assignments" element={user ? <AssignmentsPage /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

// Placeholder page for the Login flow
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
