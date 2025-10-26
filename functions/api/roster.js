// functions/api/roster.js
const { verifyTokenAndGetUid } = require('../auth/security');
const admin = require('firebase-admin');

// --- HELPER FUNCTION: Normalizes Headers (Fuzzy Mapping) ---
const FUZZY_MAPPINGS = {
    // Canonical: [Fuzzy Synonyms]
    name: ['student name', 's name', 'full name', 'st_name', 'nmae'],
    period: ['per', 'class period', 'period #', 'p'],
    quarter: ['qtr', 'q'],
    email: ['email address', 'e mail'],
};

/**
 * Attempts to map a raw header list to canonical (standardized) keys.
 * For this simplified version, we only use direct synonyms.
 * For production, a Levenshtein distance algorithm would be used here.
 */
function normalizeHeaders(rawHeaders) {
    const headerMap = {};
    const lowerHeaders = rawHeaders.map(h => h.toLowerCase().trim());

    for (const canonicalKey in FUZZY_MAPPINGS) {
        const synonyms = [canonicalKey, ...FUZZY_MAPPINGS[canonicalKey]];

        for (const synonym of synonyms) {
            const index = lowerHeaders.indexOf(synonym);
            if (index !== -1) {
                // Map the canonical key to the actual header used in the file
                headerMap[canonicalKey] = rawHeaders[index]; 
                break;
            }
        }
    }
    return headerMap;
}
// -------------------------------------------------------------------

exports.processRoster = async (req, res) => {
    try {
        const uid = await verifyTokenAndGetUid(req.get('Authorization')?.split('Bearer ')[1]);
        
        // Mocking file parsing result for functional code:
        // Assume the parser extracts the raw headers and the student rows
        const rawHeaders = ['Student Name', 'Period #', 'Email'];
        const rows = [
            { 'Student Name': 'Alice', 'Period #': '1', 'Email': 'alice@test.com' },
            { 'Student Name': 'Bob', 'Period #': '2', 'Email': 'bob@test.com' }
        ]; 
        
        // 1. NORMALIZE HEADERS
        const headerMap = normalizeHeaders(rawHeaders);
        
        // Ensure required fields were found
        if (!headerMap.name || !headerMap.period || !headerMap.quarter) {
             return res.status(400).send({ error: "Could not automatically map required fields (Name, Period, Quarter)." });
        }

        const batch = admin.firestore().batch();
        const studentsCollection = admin.firestore().collection(`users/${uid}/students`);

        for (const row of rows) {
            const newRef = studentsCollection.doc();
            
            // 2. USE THE MAPPED HEADERS TO EXTRACT DATA SAFELY
            batch.set(newRef, {
                // Use the mapped key to extract the value from the row
                name: row[headerMap.name] ?? "N/A Student",
                email: row[headerMap.email] ?? "N/A", 
                period: row[headerMap.period] ?? "N/A",
                quarter: row[headerMap.quarter] ?? "Q1",
                masteryByStandard: {} 
            });
        }
        await batch.commit();
        res.status(200).send({ message: `${rows.length} students processed.` });
    } catch(error) {
        console.error("Roster processing failed:", error);
        res.status(500).send({ error: "Roster processing failed." });
    }
};

exports.updateStudentField = async (req, res) => {
    try {
        const uid = await verifyTokenAndGetUid(req.get('Authorization')?.split('Bearer ')[1]);
        const { studentId, field, value } = req.body;
        const studentRef = admin.firestore().doc(`users/${uid}/students/${studentId}`);
        await studentRef.update({ [field]: value });
        res.status(200).send({ success: true });
    } catch (error) {
        res.status(500).send({ error: "Failed to update student." });
    }
};
