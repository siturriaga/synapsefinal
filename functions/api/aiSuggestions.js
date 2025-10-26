// functions/api/aiSuggestions.js
const { verifyTokenAndGetUid } = require('../auth/security'); 
const { GoogleGenAI } = require('@google/genai');
const admin = require('firebase-admin');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 

exports.getAiSuggestions = async (req, res) => {
  try {
    const uid = await verifyTokenAndGetUid(req.get('Authorization')?.split('Bearer ')[1]);
    
    const studentsSnap = await admin.firestore().collection(`users/${uid}/students`).get();
    const students = studentsSnap.docs.map(doc => doc.data());

    if (students.length < 5) {
      // MANDATE: N/A for insufficient data
      return res.status(200).send({
        suggestion: "N/A - Insufficient student data (less than 5 records).",
        action: "Upload more student mastery data.",
      });
    }

    // 1. Aggregate and prepare data payload for Gemini
    const dataPayload = students.map(s => ({ 
        name: s.name, 
        mastery: s.masteryByStandard 
    }));
    
    const instruction = `Analyze the following student mastery data and provide 3 actionable, prioritized suggestions for the teacher. Data: ${JSON.stringify(dataPayload)}`;

    const response = await ai.models.generateContent({ /* ... config ... */ });
    const analysis = JSON.parse(response.text.trim());
    
    return res.status(200).send(analysis);

  } catch (error) {
    console.error('AI Insights Error:', error);
    res.status(500).send({ suggestion: "N/A - Error retrieving insights.", action: "Check server logs." });
  }
};
