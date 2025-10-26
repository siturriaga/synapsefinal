// src/pages/AssignmentsPage.jsx
import React, { useState } from 'react';
import { AssignmentGenerator } from '@/components/AssignmentGenerator';
import { useStandards } from '@/hooks/useStandards'; // <-- NEW HOOK IMPORT

export default function AssignmentsPage() {
    const { standards, loading: standardsLoading } = useStandards();
    
    // State to hold the standards the user selects from the list
    const [selectedStandards, setSelectedStandards] = useState([]); 
    
    // Automatically select a few standards once loaded for a default view
    useEffect(() => {
        if (!standardsLoading && standards.length > 0 && selectedStandards.length === 0) {
            // Select the first 3 standards by default
            setSelectedStandards(standards.slice(0, 3).map(s => s.id));
        }
    }, [standards, standardsLoading, selectedStandards.length]);

    if (standardsLoading) {
        return <div className="p-8 text-xl">Loading standards library...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">AI Assignment Engine</h1>
            
            <div className="mb-4">
                <h2 className="text-xl font-semibold">Standards Selection ({standards.length} available)</h2>
                {/* TODO: Implement a UI (e.g., checkboxes) here to allow the teacher
                  to change the selection and update the selectedStandards state.
                */}
                <p className="text-sm mt-2">Currently Targeting: **{selectedStandards.join(', ') || 'N/A - Select standards'}**</p>
            </div>

            <AssignmentGenerator standards={selectedStandards} />
        </div>
    );
}
