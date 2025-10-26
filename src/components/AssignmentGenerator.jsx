// src/components/AssignmentGenerator.jsx
import React, { useState } from 'react';
// import { api } from '@/utils/api'; // Assumed utility for API calls

export function AssignmentGenerator({ standards }) {
    const [form, setForm] = useState({ difficulty: 'On Level', type: 'Quiz', count: 10 });
    const [result, setResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Call the functions/api/generateAssignment endpoint
            console.log("API Call: Generating Assignment...");
            // const response = await api.post('/ai/generateAssignment', { ...form, standards });
            // setResult(response.data);
            
            // Mock result for UI demo:
            setResult({ title: "New Assignment", items: [{ id: 1, content: "What is X?" }], story_text: "N/A" });
        } catch (error) {
            setResult({ title: "Generation Failed: N/A", items: [{ id: 0, content: "Critical Error: N/A" }], story_text: "N/A" });
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="p-6 bg-white shadow rounded-lg">
                <p>Targeting Standards: {standards.join(', ') || 'None Selected'}</p>
                
                {/* 🚨 FIX IS HERE: The button tag must be closed properly */}
                <button type="submit" className="btn btn-primary">
                    Generate Differentiated Assignment
                </button>
                
            </form>
            
            {result && (
                <div className="p-6 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                    <h3 className="text-xl font-bold">{result.title}</h3>
                    {result.story_text && result.story_text !== "N/A" && <p className="mt-2">{result.story_text}</p>}
                    <ol className="list-decimal pl-5 mt-4">
                        {result.items.map(item => (
                            <li key={item.id} className={item.content === "N/A" ? 'text-red-600' : ''}>
                                {item.content}
                            </li>
                        ))}
                    </ol>
                </div>
            )}
        </div>
    );
}
