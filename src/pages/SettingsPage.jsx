// src/pages/SettingsPage.jsx (Fixing select menus)
import React, { useState } from 'react';
import { useSynapseData } from '@/hooks/useSynapseData';

// ... (existing code and imports) ...

export default function SettingsPage() {
    // ... (existing state and handleChange function) ...
    
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Teacher Profile & Settings</h1>
            
            <div className="space-y-6 max-w-lg bg-white p-6 rounded shadow-lg">
                <p className="text-sm text-green-600 font-medium h-4">{status}</p>

                {/* Subject Selection FIX: Added htmlFor="subject" and id="subject" */}
                <div className="flex items-center">
                    <label htmlFor="subject" className="block text-lg font-medium w-36">Teaching Subject:</label>
                    <select 
                        name="subject"
                        id="subject" // <-- ADDED ID
                        value={profile.subject || 'General'}
                        onChange={handleChange}
                        className="flex-grow p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        {/* options */}
                    </select>
                </div>

                {/* Grade Selection FIX: Added htmlFor="grade" and id="grade" */}
                <div className="flex items-center">
                    <label htmlFor="grade" className="block text-lg font-medium w-36">Grade Level:</label>
                    <select 
                        name="grade"
                        id="grade" // <-- ADDED ID
                        value={profile.grade || 'K-12'}
                        onChange={handleChange}
                        className="flex-grow p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        {/* options */}
                    </select>
                </div>
            </div>
            {/* ... rest of the page ... */}
        </div>
    );
}
