// src/pages/Dashboard.jsx
import React from 'react';
import { useSynapseData } from '@/hooks/useSynapseData';

export default function Dashboard() {
    const { profile, students } = useSynapseData(); // Retrieves 'profile' object

    // Renders the personalized welcome message
    return (
        <div className="p-8">
            {/* The dynamic welcome message */}
            <h1 className="text-3xl font-bold">Welcome, {profile.name}!</h1>
            <p>You have {students.length} students across {profile.subject} classes.</p>
            {/* ... other content ... */}
        </div>
    );
}
