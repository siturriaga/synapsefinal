// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 
import { AuthProvider, useAuth } from './contexts/AuthContext'; 
import { useSynapseData } from './hooks/useSynapseData'; 

// Page Imports
import Dashboard from './pages/Dashboard';
import RosterPage from './pages/RosterPage'; 
import AssignmentsPage from './pages/AssignmentsPage';
import SettingsPage from './pages/SettingsPage'; // Ensure this is imported
// 🚨 New Component Import for Navigation
import { Header } from '@/components/common/Header'; 

const queryClient = new QueryClient();

// Component to handle Authentication and Page Rendering
const AppRoutes = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const { loading: dataLoading } = useSynapseData();

  if (authLoading || dataLoading) return <div id="loading-overlay">Initializing Synapse Co-Pilot...</div>;

  // If user is NOT logged in, show only the login page
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }
  
  // If user IS logged in, show Header and protected routes
  return (
    <div className="min-h-screen">
      {/* 🚨 NAVIGATION FIX: Header is displayed above all content */}
      <Header /> 
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

// Component for the Navigation Header (Moved here for dependency clarity)
function Header() {
    const { logout } = useAuth();
    return (
        <header style={{ padding: '15px', background: '#f5f5f5', borderBottom: '1px solid #ddd' }} className="flex justify-between items-center">
            <Link to="/" style={{ fontWeight: 'bold', fontSize: '18px' }}>Synapse Co-Pilot</Link>
            <nav className="space-x-4">
                <Link to="/roster" style={{ marginRight: '15px' }}>Roster</Link>
                <Link to="/assignments" style={{ marginRight: '15px' }}>Assignments</Link>
                <Link to="/settings" style={{ marginRight: '15px' }}>Settings</Link>
                <button onClick={logout} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Logout</button>
            </nav>
        </header>
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
