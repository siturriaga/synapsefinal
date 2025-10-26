// scripts/ingestStandards.js
// Reads all .json files in the 'scripts' directory and bulk uploads them to the 'standards' collection in Firestore.

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const STANDARDS_DIR = __dirname; 

// --- 1. SECURE INITIALIZATION ---
// Uses environment variables for security (FIREBASE_PRIVATE_KEY, etc.).
try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    if (!privateKey) {
        throw new Error("FIREBASE_PRIVATE_KEY is not loaded in the local environment.");
    }
    
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: privateKey,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        })
    });
} catch (error) {
    console.error("❌ Admin SDK Initialization Failed:", error.message);
    console.error("ACTION: Please load the required FIREBASE_* environment variables before running the script.");
    return;
}

const db = admin.firestore();

/**
 * Loads all standards data from multiple JSON files and uploads them to Firestore.
 */
async function ingestAllStandards() {
    console.log("Starting Synapse Standards Ingestion...");

    const files = fs.readdirSync(STANDARDS_DIR).filter(file => file.endsWith('.json') && file !== path.basename(process.argv[1]));
    let totalCount = 0;
    
    if (files.length === 0) {
        console.error("❌ No JSON standards files found in the 'scripts/' directory.");
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
                console.warn(`Skipping file ${file}: Content is not a valid JSON array. Must be [{}, {}, ...].`);
                continue;
            }

            for (const item of standardsArray) {
                // REQUIRED DATA CONGRUENCE CHECK (Ensuring the AI has the right data)
                if (!item.id || !item.description || !item.subject || !item.grade) {
                    console.warn(`Skipping malformed standard in ${file}: Missing ID, description, subject, or grade.`);
                    continue;
                }

                // Use the standard ID (e.g., RL.7.1) as the document ID
                const docRef = collectionRef.doc(item.id); 
                
                batch.set(docRef, {
                    description: item.description,
                    subject: item.subject,
                    grade: item.grade
                });
                totalCount++;
            }
            console.log(`[${file}] added ${standardsArray.length} items to the batch.`);

        } catch (error) {
            console.error(`❌ Failed to process file ${file}: ${error.message}`);
        }
    }

    if (totalCount > 0) {
        await batch.commit();
        console.log(`\n✅ INGESTION COMPLETE: Total ${totalCount} standards committed to Firestore.`);
    } else {
        console.log("⚠️ No valid standards found to commit. Batch not executed.");
    }
}

ingestAllStandards();
