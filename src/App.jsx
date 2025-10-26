// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// ... Context and QueryClient imports ...
// ... Page component imports (Dashboard, RosterPage, AssignmentsPage) ...

// ThemedApp component applies the theme/layout from useSynapseData

export default function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider> 
            <ThemedApp />
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}
