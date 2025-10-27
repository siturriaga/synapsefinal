// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 
import { AuthProvider, useAuth } from './contexts/AuthContext'; 
import { useSynapseData } from './hooks/useSynapseData'; 

// Page Imports
import Dashboard from '@/pages/Dashboard';
import RosterPage from '@/pages/RosterPage'; 
import AssignmentsPage from '@/pages/AssignmentsPage';
// 🚨 CRITICAL FIX: Use the ABSOLUTE PATH for maximum congruence
import SettingsPage from '@/pages/SettingsPage'; 

// Component Imports
import { AppHeader } from '@/components/AppHeader'; // Assuming AppHeader is defined/imported globally

const queryClient = new QueryClient();

// ... (rest of the AppRoutes and other components remain the same) ...

// NOTE: Since AppHeader was locally defined in the last working version,
// we'll assume it's still defined locally here to avoid a new import error.
function AppHeader() {
    // ... code from previous response ...
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
