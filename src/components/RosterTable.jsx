// src/components/RosterTable.jsx
import React from 'react';
import { useSynapseData } from '@/hooks/useSynapseData';
import { useAuth } from '@/contexts/AuthContext';
import { secureFetch } from '@/utils/apiService'; // <-- NEW IMPORT

export function RosterTable() {
    const { students, loading } = useSynapseData();
    const { user } = useAuth();

    const handleUpdate = async (studentId, field, value) => {
        if (!user || !value) return;
        
        try {
            // 🚨 FUNCTIONAL UPDATE: Use secureFetch for authenticated PUT request
            await secureFetch(
                'roster/student', 
                'PUT', 
                { studentId, field, value }, 
                user
            );
            console.log(`${field} updated successfully for ${studentId}.`);

        } catch (error) {
            console.error('Error updating roster:', error);
            alert('Error updating student data. Check console.');
        }
    };

    if (loading) return <div className="p-4 text-center">Loading student data...</div>;
    
    // Grouping logic (simplified for display)
    const studentsByPeriod = students.reduce((acc, s) => {
        const key = s.period; 
        acc[key] = acc[key] || [];
        acc[key].push(s);
        return acc;
    }, {});

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
                                            <input 
                                                type="text" 
                                                defaultValue={s.period} 
                                                onBlur={(e) => handleUpdate(s.id, 'period', e.target.value)} 
                                                style={{ border: '1px solid #ccc', width: '50px' }} 
                                                aria-label={`Edit Period for ${s.name}`}
                                            />
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
