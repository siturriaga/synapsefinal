// src/components/RosterTable.jsx
import React from 'react';
import { useSynapseData } from '@/hooks/useSynapseData';
import { useAuth } from '@/contexts/AuthContext'; 

export function RosterTable() {
    const { students, loading } = useSynapseData();
    const { user } = useAuth(); // Needed to get the secure token

    // 🚨 FINAL FUNCTIONALITY FIX: Securely updates Firestore via Cloud Function
    const handleUpdate = async (studentId, field, value) => {
        if (!user || !value) return;
        
        try {
            const token = await user.getIdToken();
            
            const response = await fetch('/api/roster/student', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, 
                },
                body: JSON.stringify({ studentId, field, value }),
            });

            if (!response.ok) {
                // Check if 401 (Unauthorized) or 500 (Server Error)
                throw new Error('Failed to update student field. Status: ' + response.status);
            }
            console.log(`${field} updated successfully for ${studentId}.`);
            // The UI updates automatically via the real-time listener

        } catch (error) {
            console.error('Error updating roster:', error);
            alert('Error updating student data. Check console.');
        }
    };

    if (loading) return <div className="p-4 text-center">Loading student data...</div>;
    
    const studentsByPeriod = students.reduce((acc, s) => {
        const key = s.period; 
        acc[key] = acc[key] || [];
        acc[key].push(s);
        return acc;
    }, {});

    // Note: Styles are minimal here to ensure functionality is the focus.
    return (
        <div style={{ border: '1px solid black', padding: '10px' }}>
            {Object.entries(studentsByPeriod).map(([period, studentList]) => (
                <section key={period} style={{ marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Period {period}</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid gray' }}><th>Name</th><th>Period</th><th>Quarter</th><th>Mastery</th></tr>
                        </thead>
                        <tbody>
                            {studentList.map(s => {
                                const avgMastery = s.masteryByStandard ? 'Calculated%' : "N/A"; 

                                return (
                                    <tr key={s.id}>
                                        <td>{s.name}</td>
                                        <td>
                                            {/* Calls API on blur */}
                                            <input type="text" defaultValue={s.period} onBlur={(e) => handleUpdate(s.id, 'period', e.target.value)} style={{ border: '1px solid #ccc', width: '50px' }}/>
                                        </td>
                                        <td>{s.quarter}</td>
                                        <td>{avgMastery}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </section>
            ))}
        </div>
    );
}
