// functions/api/roster.js
const { verifyTokenAndGetUid } = require('../auth/security');
const admin = require('firebase-admin');
const BusBoy = require('busboy');

exports.processRoster = async (req, res) => {
    // Logic for parsing multi-part form data (file upload) and saving to Firestore with N/A fallbacks.
    // ... [BusBoy file parsing and batch commit logic from previous response] ...
    res.status(200).send({ message: "Roster processing initiated (Async)." });
};

// New endpoint for manual Roster Edit
exports.updateStudentField = async (req, res) => {
    try {
        const uid = await verifyTokenAndGetUid(req.get('Authorization')?.split('Bearer ')[1]);
        const { studentId, field, value } = req.body;

        if (!studentId || !field) return res.status(400).send({ error: "Missing parameters." });

        const studentRef = admin.firestore().doc(`users/${uid}/students/${studentId}`);
        await studentRef.update({ [field]: value });

        res.status(200).send({ success: true, message: `${field} updated.` });
    } catch (error) {
        console.error("Student update failed:", error);
        res.status(500).send({ error: "Failed to update student." });
    }
};
