// functions/index.js
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

const { generateAssignment } = require('./api/generateAssignment');
const { processRoster, updateStudentField } = require('./api/roster'); 
const { getAiSuggestions } = require('./api/aiSuggestions'); 

const app = express();
app.use(cors({ origin: true }));
app.use(express.json()); 

app.post('/ai/generateAssignment', generateAssignment);
app.get('/ai/insights', getAiSuggestions);
app.post('/roster/upload', processRoster);
app.put('/roster/student/:studentId', updateStudentField); // For editing period/quarter

exports.api = functions.https.onRequest(app);
