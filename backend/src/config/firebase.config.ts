/**
 * Firebase Admin SDK initialization and configuration
 */
import * as admin from "firebase-admin";
import * as path from "path";
import * as fs from "fs";

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  // Check for service account file in development
  const serviceAccountPath = path.join(
    __dirname,
    "../../serviceAccountKey.json",
  );

  if (fs.existsSync(serviceAccountPath)) {
    // Use service account for local development
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase initialized with service account");
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Use environment variable
    admin.initializeApp();
    console.log("Firebase initialized with GOOGLE_APPLICATION_CREDENTIALS");
  } else {
    // Production environment (Cloud Functions, etc.)
    admin.initializeApp();
    console.log("Firebase initialized with default credentials");
  }
}

export const db = admin.firestore();
export const auth = admin.auth();

export default admin;
