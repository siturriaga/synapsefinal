// scripts/ingestStandards.js
// Implements batch splitting to handle large standards files reliably.

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const MAX_BATCH_SIZE = 499; // Set limit just below 500 for safety
const STANDARDS_DIR = __dirname;

// --- 1. SECURE INITIALIZATION ---
// (Requires environment variables to be loaded)
try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    if (!privateKey) throw new Error("FIREBASE_PRIVATE_KEY is not loaded.");
    
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: privateKey,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        })
    });
} catch (error) {
    console.error("❌ Admin SDK Initialization Failed:", error.message);
    console.error("ACTION: Ensure FIREBASE_* environment variables are correctly loaded.");
    return;
}

const db = admin.firestore();

/**
 * Loads all standards data from multiple JSON files and uploads them in batches.
 */
async function ingestAllStandards() {
    console.log("Starting Synapse Standards Ingestion (Batch Mode)...");

    const files = fs.readdirSync(STANDARDS_DIR).filter(file => file.endsWith('.json') && file !== path.basename(process.argv[1]));
    let totalCount = 0;
    let standardsToCommit = [];

    if (files.length === 0) {
        console.error("❌ No JSON standards files found in the 'scripts/' directory.");
        return;
    }

    // 1. COLLECT ALL STANDARDS from all files into a single array
    for (const file of files) {
        const filePath = path.join(STANDARDS_DIR, file);
        try {
            const rawData = fs.readFileSync(filePath, 'utf8');
            const standardsArray = JSON.parse(rawData);

            if (!Array.isArray(standardsArray)) continue;

            for (const item of standardsArray) {
                if (item.id && item.description && item.subject && item.grade) {
                    standardsToCommit.push(item);
                } else {
                    console.warn(`Skipping malformed standard in ${file}: ${item.id || 'Unknown ID'}`);
                }
            }
            console.log(`[Loaded ${standardsArray.length} items from ${file}]`);
        } catch (error) {
            console.error(`❌ Failed to process file ${file}: ${error.message}`);
        }
    }

    // 2. PROCESS AND COMMIT IN BATCHES
    console.log(`\nStarting commit for ${standardsToCommit.length} total valid standards...`);

    let currentBatch = db.batch();
    const collectionRef = db.collection('standards');

    for (let i = 0; i < standardsToCommit.length; i++) {
        const item = standardsToCommit[i];
        const docRef = collectionRef.doc(item.id); 
        
        currentBatch.set(docRef, {
            description: item.description,
            subject: item.subject,
            grade: item.grade
        });
        
        totalCount++;

        // If the current batch hits the limit, commit it and start a new one
        if (totalCount % MAX_BATCH_SIZE === 0) {
            console.log(`   Committing Batch ${totalCount / MAX_BATCH_SIZE}...`);
            await currentBatch.commit();
            currentBatch = db.batch(); // Start a new batch
        }
    }

    // 3. Commit the final, partial batch (if any items are left)
    if (totalCount % MAX_BATCH_SIZE !== 0) {
        await currentBatch.commit();
    }

    console.log(`\n✅ INGESTION COMPLETE: Successfully committed ${totalCount} standards to Firestore.`);
}

ingestAllStandards();