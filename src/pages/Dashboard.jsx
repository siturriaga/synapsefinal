// src/pages/Dashboard.jsx
import React from 'react';
import { useSynapseData } from '@/hooks/useSynapseData';
import { useAuth } from '@/contexts/AuthContext';
// 🚨 FIX HERE: Use the absolute path defined by jsconfig.json
import { LoginButton } from '@/components/auth/LoginButton'; 

export default function Dashboard() {
    const { profile, students } = useSynapseData();
    const { user } = useAuth();

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">Welcome, {profile.name}!</h1>
            <p>You have {students.length} students across {profile.subject} classes.</p>
            {/* Display LoginButton only if the user is not authenticated */}
            {!user && <LoginButton />} 
        </div>
    );
}
