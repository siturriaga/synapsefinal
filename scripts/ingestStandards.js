// scripts/ingestStandards.js
// Run this script locally: node scripts/ingestStandards.js

const admin = require('firebase-admin');
const fs = require('fs');

// IMPORTANT: Replace this path with your service account key file
const serviceAccount = require('/path/to/your/firebase-adminsdk-key.json'); 
const standardsFilePath = './standards_data.json'; // ASSUME your standards JSON is here

// Initialize Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

/**
 * Uploads standards data from a local JSON file to Firestore.
 */
async function ingestStandards() {
    console.log("Starting standards ingestion...");

    try {
        const rawData = fs.readFileSync(standardsFilePath, 'utf8');
        const standards = JSON.parse(rawData);

        if (!Array.isArray(standards) || standards.length === 0) {
            throw new Error("Standards file is empty or not a valid JSON array.");
        }

        const batch = db.batch();
        const collectionRef = db.collection('standards');
        let count = 0;

        for (const item of standards) {
            // Data Structure Validation (Ensures congruence with the data model)
            if (!item.id || !item.description || !item.subject || !item.grade) {
                console.warn(`Skipping malformed standard: ${JSON.stringify(item)}`);
                continue;
            }

            // Set the document ID using the standard ID (e.g., RL.7.1) for easy lookup
            const docRef = collectionRef.doc(item.id); 
            
            batch.set(docRef, {
                description: item.description,
                subject: item.subject,
                grade: item.grade
            });
            count++;
        }

        await batch.commit();
        console.log(`✅ Successfully ingested ${count} standards into Firestore.`);

    } catch (error) {
        console.error("❌ Standards ingestion failed:", error.message);
        console.error("Please check your JSON file path and format.");
    }
}

ingestStandards();
