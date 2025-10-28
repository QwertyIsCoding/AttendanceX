/**
 * Firebase Configuration Template
 *
 * This file contains the Firebase configuration and initialization for AttendanceX.
 * It serves as a template that developers can customize with their own Firebase project credentials.
 *
 * IMPORTANT SECURITY NOTES:
 * - Never commit real API keys to version control
 * - Use environment variables or build-time configuration in production
 * - The empty values below are placeholders - replace with your actual Firebase config
 * - Consider using Firebase Security Rules to restrict access
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a Firebase project at https://console.firebase.google.com/
 * 2. Enable Firestore and Authentication services
 * 3. Get your config from Project Settings > General > Your apps
 * 4. Replace the empty strings below with your actual values
 * 5. Update firestore.rules for proper security
 *
 * REQUIRED FIREBASE SERVICES:
 * - Firestore: For storing attendance data
 * - Authentication: For user sign-up/sign-in (optional but recommended)
 * - Analytics: For usage tracking (optional)
 */

// =============================================================================
// IMPORTS
// =============================================================================

// Core Firebase App (required)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";

// Analytics (optional - remove if not needed)
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";

// TODO: Add additional Firebase services as needed
// Examples:
// import { getFirestore } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
// import { getAuth } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// For a complete list of available libraries, see:
// https://firebase.google.com/docs/web/setup#available-libraries

// =============================================================================
// FIREBASE CONFIGURATION
// =============================================================================

/**
 * Firebase Configuration Object
 *
 * Replace these placeholder values with your actual Firebase project configuration.
 * You can find these values in your Firebase Console:
 * Project Settings > General > Your apps > Web app configuration
 */
const firebaseConfig = {
  // Your Firebase project's API key
  // Found in: Project Settings > General > Your apps > Web app > API key
  apiKey: "YOUR_API_KEY_HERE",

  // Your Firebase project's Auth domain
  // Format: [project-id].firebaseapp.com
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",

  // Your Firebase project ID
  // Found in: Project Settings > General > Project ID
  projectId: "YOUR_PROJECT_ID",

  // Your Firebase project's storage bucket
  // Format: [project-id].firebasestorage.app
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",

  // Your Firebase project's messaging sender ID
  // Found in: Project Settings > Cloud Messaging > Sender ID
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",

  // Your Firebase project's App ID
  // Found in: Project Settings > General > Your apps > Web app > App ID
  appId: "YOUR_APP_ID",

  // Measurement ID for Google Analytics (optional)
  // Found in: Project Settings > General > Your apps > Web app > measurementId
  // Remove this line if you don't use Analytics
  measurementId: "YOUR_MEASUREMENT_ID"
};

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Validates that all required Firebase configuration values are present.
 * Call this before initializing Firebase to catch configuration errors early.
 *
 * @returns {boolean} True if configuration is valid, throws error if invalid
 * @throws {Error} If required configuration values are missing
 */
function validateFirebaseConfig() {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingFields = requiredFields.filter(field => !firebaseConfig[field] || firebaseConfig[field] === "YOUR_" + field.toUpperCase() + "_HERE");

  if (missingFields.length > 0) {
    throw new Error(`Firebase configuration incomplete. Please provide values for: ${missingFields.join(', ')}`);
  }

  return true;
}

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initialize Firebase App
 *
 * This creates the main Firebase app instance that will be used throughout the application.
 * The app instance is exported so it can be imported by other modules.
 */
let app;
let analytics;

try {
  // Validate configuration before initializing
  validateFirebaseConfig();

  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully");

  // Initialize Analytics (optional - remove if not using analytics)
  if (firebaseConfig.measurementId) {
    analytics = getAnalytics(app);
    console.log("Firebase Analytics initialized");
  }

} catch (error) {
  console.error("Firebase initialization failed:", error);
  // In a production app, you might want to show a user-friendly error message
  // or redirect to a setup page
}

// =============================================================================
// EXPORTS
// =============================================================================

// Export the app instance for use in other modules
export { app, analytics };

// Optional: Export additional Firebase services if initialized
// export const db = getFirestore(app);
// export const auth = getAuth(app);

// =============================================================================
// USAGE EXAMPLE
// =============================================================================

/*
 * To use this configuration in other files:
 *
 * import { app } from './firebase-config.js';
 * import { getFirestore } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
 *
 * const db = getFirestore(app);
 *
 * // Now you can use db for Firestore operations
 */