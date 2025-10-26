// functions/auth/security.js
const admin = require('firebase-admin');

if (!admin.apps.length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    if (!privateKey) throw new Error("CRITICAL: FIREBASE_PRIVATE_KEY missing.");
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: privateKey,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      })
    });
  } catch (error) {
    console.error("ADMIN SDK INIT FAILED:", error.message);
    throw new Error("System configuration instability.");
  }
}

exports.verifyTokenAndGetUid = async (token) => {
  if (!token) throw new Error('Authentication token required.');
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    console.error('Token verification failed (401):', error.message);
    throw new Error('Invalid or expired authentication token.');
  }
};
