// src/pages/RosterPage.jsx
import React from 'react';
import { RosterTable } from '@/components/RosterTable'; 
import { useSynapseData } from '@/hooks/useSynapseData';
import { groupStudentsHeterogeneously } from '@/utils/groupingAlgorithm';

function RosterPage() { 
    const { students } = useSynapseData();

    const handleGenerateGroups = () => {
        const groups = groupStudentsHeterogeneously(students);
        console.log("Generated Heterogeneous Groups:", groups);
        alert(`Successfully generated ${groups.length} balanced groups!`);
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Class Roster & Management</h1>
            <div className="flex justify-between mb-6">
                <button className="btn btn-primary">+ Upload Roster</button>
                <button onClick={handleGenerateGroups} className="btn btn-secondary">
                    Generate Heterogeneous Groups
                </button>
            </div>
            <RosterTable />
        </div>
    );
}

// 🚨 CRITICAL FIX: Export as default to match import in App.jsx
export default RosterPage;
