// functions/api/generateAssignment.js
const { verifyTokenAndGetUid } = require('../auth/security'); 
const { GoogleGenAI } = require('@google/genai');
const admin = require('firebase-admin');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 

exports.generateAssignment = async (req, res) => {
  try {
    const uid = await verifyTokenAndGetUid(req.get('Authorization')?.split('Bearer ')[1]);
    
    const profileSnap = await admin.firestore().doc(`users/${uid}/profile/settings`).get();
    const profile = profileSnap.data() || {};
    
    const { standards = [], difficulty = 'On Level', assignmentType = 'Quiz', questionCount = 10 } = req.body;
    
    const standardsList = standards.join(', ');
    const teacherSubject = profile.subject ?? "General Education";

    const instruction = `
      You are Synapse, an expert educational co-pilot for a ${teacherSubject} teacher. 
      ... [Detailed prompt logic] ...
      MANDATE: Your entire response MUST be a single, valid JSON object. If you cannot generate content for any section, the value for that field MUST be the string "N/A" or null.
      Expected JSON Structure:
      {
        "title": "Synapse Assignment: ${assignmentType}",
        "metadata": { "difficulty": "${difficulty}", "standards": "${standardsList}" },
        "items": [ 
          {"id": 1, "type": "multiple-choice/concept", "content": "..."}
        ],
        "story_text": null 
      }
    `;

    const response = await ai.models.generateContent({ /* ... config ... */ });
    const assignmentData = JSON.parse(response.text.trim());
    
    return res.status(200).send(assignmentData);

  } catch (error) {
    console.error('Gemini Generation Critical Error:', error);
    return res.status(500).send({ 
        title: "AI Service Failure: N/A",
        metadata: { status: "N/A" },
        items: [{ id: 0, content: "N/A - Critical failure." }]
    });
  }
};
