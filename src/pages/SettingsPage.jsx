// src/pages/SettingsPage.jsx
import React, { useState } from 'react';
import { useSynapseData } from '@/hooks/useSynapseData';

// Options defined here as per best practice
const SUBJECT_OPTIONS = ['ELA', 'Math', 'Science', 'History'];
const GRADE_OPTIONS = ['6', '7', '8', '9', '10', '11', '12', 'K-12'];

export default function SettingsPage() {
    // Access the profile data and the function to update it
    const { profile, updateProfileSetting } = useSynapseData();
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // CRITICAL ACTION: This updates the Firestore profile document in real-time
        updateProfileSetting(name, value); 
        
        setStatus(`Updated ${name} to ${value}!`);
        setTimeout(() => setStatus(''), 2000);
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Teacher Profile & Settings</h1>
            
            <div className="space-y-6 max-w-lg bg-white p-6 rounded shadow-lg">
                <p className="text-sm text-green-600 font-medium h-4">{status}</p>

                {/* Subject Selection */}
                <div className="flex items-center">
                    <label className="block text-lg font-medium w-36">Teaching Subject:</label>
                    <select 
                        name="subject"
                        value={profile.subject || 'General'}
                        onChange={handleChange}
                        className="flex-grow p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="General" disabled>— Select Subject —</option>
                        {SUBJECT_OPTIONS.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                    </select>
                </div>

                {/* Grade Selection */}
                <div className="flex items-center">
                    <label className="block text-lg font-medium w-36">Grade Level:</label>
                    <select 
                        name="grade"
                        value={profile.grade || 'K-12'}
                        onChange={handleChange}
                        className="flex-grow p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="K-12" disabled>— Select Grade —</option>
                        {GRADE_OPTIONS.map(grade => <option key={grade} value={grade}>{grade}</option>)}
                    </select>
                </div>

                <p className="text-sm text-gray-500 mt-4">
                    Your selections here instantly filter the standards available on the Assignments page.
                </p>
            </div>
        </div>
    );
}
