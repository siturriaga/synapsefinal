// src/components/common/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
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
