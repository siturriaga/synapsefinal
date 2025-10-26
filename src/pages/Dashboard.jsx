// src/pages/Dashboard.jsx
import React from 'react';
import { useSynapseData } from '@/hooks/useSynapseData';
import { useAuth } from '@/contexts/AuthContext'; // 🚨 Ensure this import exists
import { LoginButton } from '@/components/auth/LoginButton'; // Assuming LoginButton is used if user is null

export default function Dashboard() {
    const { profile, students } = useSynapseData();
    const { user } = useAuth(); // Used to conditionally display Login/Dashboard

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">Welcome, {profile.name}!</h1>
            <p>You have {students.length} students across {profile.subject} classes.</p>
            {!user && <LoginButton />} 
        </div>
    );
}
