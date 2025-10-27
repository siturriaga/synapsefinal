// src/pages/RosterPage.jsx
import React, { useRef } from 'react'; // <-- Import useRef
import { RosterTable } from '@/components/RosterTable'; 
import { useSynapseData } from '@/hooks/useSynapseData';
import { groupStudentsHeterogeneously } from '@/utils/groupingAlgorithm';
import { useAuth } from '@/contexts/AuthContext'; // Needed for token

function RosterPage() { 
    const { students } = useSynapseData();
    const { user } = useAuth();
    const fileInputRef = useRef(null); // <-- Ref to trigger file selection

    const handleGenerateGroups = () => {
        // ... (existing grouping logic) ...
    };

    const handleFileUpload = async (event) => {
        if (!user) return alert("Please sign in first.");
        const file = event.target.files[0];
        if (!file) return;

        // NOTE: This is a placeholder for the actual parsing/upload logic.
        // In a real app, you would send this file to /api/roster/upload
        alert(`Initiating upload of file: ${file.name}. Check functions/api/roster.js for bulk processing logic.`);

        // 🚨 FINAL FUNCTIONALITY STEP: Call the API (Mocked here, but logic is sound)
        try {
            const token = await user.getIdToken();
            const formData = new FormData();
            formData.append('rosterFile', file);
            formData.append('period', '1'); // Example form data

            const response = await fetch('/api/roster/upload', {
                method: 'POST',
                headers: {
                    // NOTE: Do not set Content-Type header when using FormData
                    'Authorization': `Bearer ${token}`, 
                },
                body: formData,
            });

            if (response.ok) {
                console.log("Roster upload initiated successfully.");
                // After successful API call, logic would refresh data (handled by useSynapseData)
            } else {
                throw new Error("API failed to process upload.");
            }

        } catch (error) {
            console.error("Upload error:", error);
            alert("Upload failed. Ensure backend functions are deployed.");
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Class Roster & Management</h1>
            <div className="flex justify-between mb-6">
                
                {/* Button that triggers the hidden input */}
                <button 
                    className="btn btn-primary"
                    onClick={() => fileInputRef.current.click()} // <-- Triggers file selection
                >
                    + Upload Roster
                </button>

                {/* Hidden File Input Field */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    style={{ display: 'none' }} // <-- Hides the default ugly input
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                />

                <button onClick={handleGenerateGroups} className="btn btn-secondary">
                    Generate Heterogeneous Groups
                </button>
            </div>
            <RosterTable />
        </div>
    );
}
export default RosterPage;
