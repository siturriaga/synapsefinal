// src/components/AssignmentGenerator.jsx
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function AssignmentGenerator({ standards }) {
    const { user } = useAuth();
    const [form, setForm] = useState({ difficulty: 'On Level', type: 'Quiz', count: 10 });
    const [result, setResult] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // 🚨 FINAL FUNCTIONALITY FIX: Securely calls the Gemini Cloud Function
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || standards.length === 0) return alert("Please select standards and ensure you are logged in.");
        
        setIsGenerating(true);
        setResult(null);

        try {
            const token = await user.getIdToken();
            
            const response = await fetch('/api/ai/generateAssignment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Secure access
                },
                body: JSON.stringify({ ...form, standards }),
            });

            const data = await response.json();
            
            if (!response.ok || data.title?.includes('N/A')) {
                 // Check for explicit error from server
                 throw new Error(data.error || 'Server returned structured N/A error.');
            }
            
            setResult(data);

        } catch (error) {
            console.error('AI Generation Failed:', error);
            setResult({ title: "Generation Failed: N/A", items: [{ id: 0, content: "Network or Server Error: N/A" }], story_text: "N/A" });
            alert("AI Generation Failed. See console for network status.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '15px' }}>
            <form onSubmit={handleSubmit}>
                <p>Targeting Standards: {standards.join(', ') || 'None Selected'}</p>
                <button type="submit" disabled={isGenerating} style={{ padding: '8px 15px', background: '#333', color: 'white', border: 'none', cursor: 'pointer' }}>
                    {isGenerating ? 'Generating...' : 'Generate Differentiated Assignment'}
                </button>
            </form>
            
            {result && (
                <div style={{ marginTop: '20px', borderLeft: '3px solid blue', paddingLeft: '10px' }}>
                    <h3>{result.title}</h3>
                    <p>Status: Content Loaded. (Check Network Tab for API Success)</p>
                </div>
            )}
        </div>
    );
}
