// scripts/ingestStandards.js
// This script now reads ALL JSON files in the directory and uploads them.

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// 🚨 CRITICAL: Set the directory where your JSON files are located
const STANDARDS_DIR = __dirname; 
// 🚨 CRITICAL: Replace this path with your service account key file
const serviceAccount = require('/path/to/your/firebase-adminsdk-key.json'); 

// Initialize Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

/**
 * Loads all standards data from multiple JSON files and uploads them to Firestore.
 */
async function ingestAllStandards() {
    console.log("Starting standards ingestion...");

    // 1. Get all JSON files in the current directory (scripts/)
    const files = fs.readdirSync(STANDARDS_DIR).filter(file => file.endsWith('.json'));
    let totalCount = 0;
    
    if (files.length === 0) {
        console.error("❌ No JSON standards files found in the directory.");
        return;
    }

    const batch = db.batch();
    const collectionRef = db.collection('standards');

    for (const file of files) {
        const filePath = path.join(STANDARDS_DIR, file);
        
        try {
            const rawData = fs.readFileSync(filePath, 'utf8');
            const standardsArray = JSON.parse(rawData);

            if (!Array.isArray(standardsArray)) {
                console.warn(`Skipping file ${file}: Content is not a valid JSON array.`);
                continue;
            }

            for (const item of standardsArray) {
                // Ensure data congruence with the required model: id, description, subject, grade
                if (!item.id || !item.description || !item.subject || !item.grade) {
                    console.warn(`Skipping malformed standard in ${file}: Missing key fields.`);
                    continue;
                }

                const docRef = collectionRef.doc(item.id); 
                
                batch.set(docRef, {
                    description: item.description,
                    subject: item.subject,
                    grade: item.grade
                });
                totalCount++;
            }
            console.log(`[${file}] successfully added ${standardsArray.length} items to the batch.`);

        } catch (error) {
            console.error(`❌ Failed to process file ${file}: ${error.message}`);
        }
    }

    if (totalCount > 0) {
        await batch.commit();
        console.log(`\n✅ INGESTION COMPLETE: Total ${totalCount} standards committed to Firestore.`);
    } else {
        console.log("⚠️ No valid standards found to commit.");
    }
}

ingestAllStandards();
