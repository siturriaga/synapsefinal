// src/pages/SettingsPage.jsx
import React, { useState } from 'react';
import { useSynapseData } from '@/hooks/useSynapseData';

const SUBJECT_OPTIONS = ['ELA', 'Math', 'Science', 'History'];
const GRADE_OPTIONS = ['6', '7', '8', '9', '10', '11', '12', 'K-12'];

export default function SettingsPage() {
    const { profile, updateProfileSetting } = useSynapseData();
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        updateProfileSetting(name, value);
        setStatus(`Updated ${name} to ${value}!`);
        setTimeout(() => setStatus(''), 2000);
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Teacher Profile & Settings</h1>
            
            <div className="space-y-4 max-w-md bg-white p-6 rounded shadow">
                <p className="text-sm text-green-600">{status}</p>

                {/* Subject Selection UI */}
                <div>
                    <label className="block text-sm font-medium mb-1">Teaching Subject:</label>
                    <select 
                        name="subject"
                        value={profile.subject || 'General'}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="General" disabled>Select Subject</option>
                        {SUBJECT_OPTIONS.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                    </select>
                </div>

                {/* Grade Selection UI */}
                <div>
                    <label className="block text-sm font-medium mb-1">Grade Level:</label>
                    <select 
                        name="grade"
                        value={profile.grade || 'K-12'}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="K-12" disabled>Select Grade</option>
                        {GRADE_OPTIONS.map(grade => <option key={grade} value={grade}>{grade}</option>)}
                    </select>
                </div>
            </div>
            
            <p className="mt-6 text-gray-600">Standards are filtered based on these selections.</p>
        </div>
    );
}
