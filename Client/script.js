/**
 * AttendanceX - Machine Learning-Based Attendance Tracking System
 *
 * This script handles the core functionality for real-time student recognition
 * using Teachable Machine models, Firebase integration for data storage,
 * and user authentication.
 *
 * ARCHITECTURE OVERVIEW:
 * This main script combines functionality from multiple subsystems:
 * - Model management (currently inline, future: modelManager.js)
 * - Data logging (integrated from logging.js - collectData calls needed)
 * - Text export (integrated from textbox.js - downloadFile available globally)
 * - Navigation (conflicts with history.js - using inline history.back())
 *
 * SUBSYSTEM INTEGRATION STATUS:
 * ✓ textbox.js: Fully integrated - downloadFile() available globally
 * ⚠ logging.js: Partially integrated - collectData() needs to be called in predict()
 * ⚠ history.js: Conflicts with test.html button - consider removing history.js
 * ○ modelManager.js: Not integrated - placeholder for future model switching
 */

// =============================================================================
// CONFIGURATION AND CONSTANTS
// =============================================================================

/**
 * Firebase configuration object.
 * NOTE: This is empty in the public repository for security reasons.
 * Populate with your Firebase project config from firebase-config.js
 */
const firebaseConfig = {
  // Add your Firebase config here or import from firebase-config.js
};

/**
 * URL for the Teachable Machine model.
 * Change this to point to your trained model.
 */
const URL = "https://teachablemachine.withgoogle.com/models/M28B_0nhQ/";

// =============================================================================
// GLOBAL VARIABLES
// =============================================================================

/**
 * Teachable Machine model instance
 * @type {tmImage.CustomMobileNet}
 */
let model;

/**
 * Webcam instance for capturing video feed
 * @type {tmImage.Webcam}
 */
let webcam;

/**
 * Container element for displaying prediction labels
 * @type {HTMLElement}
 */
let labelContainer;

/**
 * Maximum number of predictions (classes) in the model
 * @type {number}
 */
let maxPredictions;

/**
 * Animation frame ID for the prediction loop
 * @type {number}
 */
let animationFrame;

/**
 * List of students present (detected with high confidence)
 * @type {string[]}
 */
let listPresent = [];

/**
 * List of students absent (not detected)
 * @type {string[]}
 */
let listAbsent = [];

/**
 * List of all student names from the model labels
 * @type {string[]}
 */
let listStudents = [];

/**
 * Array to store prediction results for display
 * @type {string[]}
 */
let myArray = [];

/**
 * Array of currently present students
 * @type {string[]}
 */
let present = [];

/**
 * Indexes array (currently unused)
 * @type {number[]}
 */
let indexes = [];

/**
 * Index counter (currently unused)
 * @type {number}
 */
let index = 0;

// =============================================================================
// FIREBASE FUNCTIONS
// =============================================================================

/**
 * Saves attendance data to Firebase Firestore.
 * Initializes Firebase if not already done, prepares attendance data
 * with present/absent lists, date, and timestamp, then saves to Firestore.
 *
 * @async
 * @function saveToCloud
 * @returns {Promise<void>}
 * @throws {Error} If Firebase initialization or save operation fails
 */
async function saveToCloud() {
  try {
    // Initialize Firebase if not already initialized
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    const db = firebase.firestore();

    // Get current date and timestamp
    const now = new Date();
    const timestamp = now.toISOString();

    // Prepare attendance data object
    const attendanceData = {
      present: listPresent,
      absent: listAbsent,
      date: now.toDateString(),
      timestamp: timestamp,
    };

    // Save to Firestore collection "attendance" with timestamp as document ID
    await db.collection("attendance").doc(timestamp).set(attendanceData);
    console.log("Attendance data saved successfully");
  } catch (error) {
    console.error("Error saving attendance data:", error);
  }
}

/**
 * Signs up a new user with Firebase Authentication.
 * Retrieves email and password from form inputs and creates a new account.
 *
 * @async
 * @function signUp
 * @returns {Promise<void>}
 * @throws {Error} If sign-up fails (invalid email, weak password, etc.)
 */
async function signUp() {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  try {
    // Note: 'auth' should be imported from Firebase Auth
    // const { getAuth, createUserWithEmailAndPassword } = ...;
    // const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User signed up:", userCredential.user);
  } catch (error) {
    console.error("Error signing up:", error);
  }
}

/**
 * Logs in an existing user with Firebase Authentication.
 * Retrieves email and password from form inputs and signs in the user.
 *
 * @async
 * @function logIn
 * @returns {Promise<void>}
 * @throws {Error} If login fails (invalid credentials, etc.)
 */
async function logIn() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    // Note: 'auth' should be imported from Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in:", userCredential.user);
  } catch (error) {
    console.error("Error logging in:", error);
  }
}

// =============================================================================
// MODEL AND WEBCAM FUNCTIONS
// =============================================================================

/**
 * Initializes the Teachable Machine model and webcam.
 * Loads the model and metadata, sets up the webcam, and starts the prediction loop.
 *
 * @async
 * @function init
 * @returns {Promise<void>}
 * @throws {Error} If model loading or webcam setup fails
 */
async function init() {
  try {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Load the Teachable Machine model
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Fetch metadata and populate student list
    const metadata = await fetch(metadataURL).then(response => response.json());
    listStudents = metadata.labels;

    // Set up webcam with flip option
    const flip = true; // Flip the webcam feed horizontally
    webcam = new tmImage.Webcam(200, 200, flip);
    await webcam.setup(); // Request user permission for camera access
    await webcam.play();

    // Start the prediction loop
    animationFrame = window.requestAnimationFrame(loop);

    // Append webcam canvas to the page
    document.getElementById("webcam-container").appendChild(webcam.canvas);

    // Set up label container for predictions
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
      labelContainer.appendChild(document.createElement("div"));
    }
  } catch (error) {
    console.error("Error initializing model and webcam:", error);
  }
}

/**
 * Stops the webcam, unloads the model, and cleans up resources.
 * Cancels the animation loop, removes webcam canvas, clears labels.
 *
 * @async
 * @function stopModel
 * @returns {Promise<void>}
 */
async function stopModel() {
  // Stop and clean up webcam
  if (webcam) {
    webcam.stop();
    const webcamContainer = document.getElementById("webcam-container");
    if (webcamContainer && webcam.canvas) {
      webcamContainer.removeChild(webcam.canvas);
    }
    webcam = null;
  }

  // Unload model (set to null for garbage collection)
  if (model) {
    // Teachable Machine doesn't have a built-in unload method
    model = null;
  }

  // Clear prediction labels
  if (labelContainer) {
    labelContainer.innerHTML = "";
  }

  // Cancel animation frame
  if (animationFrame) {
    window.cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }

  maxPredictions = 0;
}

/**
 * Main prediction loop that runs continuously.
 * Updates the webcam frame and triggers prediction on each iteration.
 *
 * @async
 * @function loop
 * @returns {Promise<void>}
 */
async function loop() {
  if (webcam) {
    webcam.update(); // Update webcam frame
    await predict(); // Run prediction
    animationFrame = window.requestAnimationFrame(loop); // Continue loop
  }
}

// =============================================================================
// PREDICTION AND ATTENDANCE FUNCTIONS
// =============================================================================

/**
 * Runs the image classification prediction on the current webcam frame.
 * Updates UI with prediction results and manages attendance tracking.
 *
 * INTEGRATION NOTES:
 * - Calls collectData() from logging.js subsystem for data collection
 * - Should log all predictions, not just high-confidence ones
 *
 * @async
 * @function predict
 * @returns {Promise<void>}
 * @throws {Error} If model prediction fails
 */
async function predict() {
  if (!model || !webcam) return;

  try {
    const prediction = await model.predict(webcam.canvas);

    for (let i = 0; i < maxPredictions; i++) {
      // Update label container with prediction results
      const classPrediction = `${prediction[i].className}: ${prediction[i].probability.toFixed(1)}`;
      if (labelContainer.childNodes[i]) {
        labelContainer.childNodes[i].innerHTML = classPrediction;
      }

      // Log all predictions to logging subsystem (collectData from logging.js)
      // TODO: Integrate - currently logging.js collectData() is not being called
      // collectData(prediction[i].className, prediction[i].probability);

      // Handle high-confidence predictions (>90%)
      if (prediction[i].probability > 0.9) {
        const studentName = prediction[i].className;

        // Update constant data display
        document.getElementById("constantData").innerHTML =
          `${studentName}: ${prediction[i].probability.toFixed(2)}`;

        // Add to arrays if not already present
        if (!myArray.includes(studentName)) {
          myArray.push(studentName);
        }
        if (!present.includes(studentName)) {
          present.push(studentName);
        }

        // Add to ordered list in UI
        const list = document.getElementById("demo");
        if (list) {
          const entry = document.createElement("li");
          entry.textContent = `${studentName}: ${prediction[i].probability.toFixed(2)}`;
          list.appendChild(entry);
        }
      } else {
        // Low confidence - show confusion message
        document.getElementById("constantData").innerHTML = "I AM CONFUSED";
      }
    }
  } catch (error) {
    console.error("Error during prediction:", error);
  }
}

// =============================================================================
// UI AND DISPLAY FUNCTIONS
// =============================================================================

/**
 * Displays the list of present students.
 * Clears the document body and appends paragraphs for each detected student.
 * Note: This function clears the entire page, which may not be ideal for production.
 *
 * @function showArray
 */
function showArray() {
  document.body.innerHTML = ""; // Clear entire page (destructive)

  myArray.forEach(student => {
    if (student !== "Empty") {
      const element = document.createElement("p");
      element.textContent = student;
      document.body.appendChild(element);
    }
  });
}

/**
 * Displays the list of absent students.
 * Calculates absent students as those in listStudents but not in present array.
 * Clears the document body and appends paragraphs for each absent student.
 * Note: This function clears the entire page, which may not be ideal for production.
 *
 * @function showAbsent
 */
function showAbsent() {
  document.body.innerHTML = ""; // Clear entire page (destructive)

  listStudents.forEach(student => {
    if (!present.includes(student)) {
      const element = document.createElement("p");
      element.textContent = student;
      document.body.appendChild(element);
    }
  });
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Refreshes the current page.
 *
 * @function refresh
 */
function refresh() {
  window.location.reload();
}

/**
 * Stops code execution by clearing event listeners and document content.
 * Note: This is a drastic measure and may break the application.
 *
 * @function breakCode
 */
function breakCode() {
  document.removeEventListener("DOMContentLoaded", () => {}, false);
  document.removeEventListener("load", () => {}, false);
  document.write(""); // Clear document
}

/**
 * Creates and appends a test button to the document body.
 * This appears to be unused/test code.
 *
 * INTEGRATION NOTES:
 * - This function conflicts with navigation in history.js subsystem
 * - history.js creates a button programmatically, test.html has its own button
 * - Consider removing this and relying on test.html navigation
 *
 * @function myFunction
 * @deprecated Consider removing - conflicts with history.js and test.html navigation
 */
function myFunction() {
  const button = document.createElement("BUTTON");
  const text = document.createTextNode("Click me");
  button.appendChild(text);
  document.body.appendChild(button);
}

// =============================================================================
// SUBSYSTEM INTEGRATION SUMMARY
// =============================================================================

/*
 * FINAL INTEGRATION STATUS:
 *
 * ✅ WORKING INTEGRATIONS:
 * - textbox.js: downloadFile() called from test.html button, works perfectly
 * - Basic model loading: inline in init(), could be moved to modelManager.js
 *
 * ⚠️ PARTIAL INTEGRATIONS:
 * - logging.js: exportData() works from button, but collectData() not called in predict()
 * - history.js: Conflicts with test.html - duplicate navigation functionality
 *
 * 🔄 FUTURE INTEGRATIONS:
 * - modelManager.js: Placeholder for model switching - not yet implemented
 * - Enhanced logging: Add collectData() calls throughout prediction flow
 *
 * RECOMMENDATIONS:
 * 1. Add collectData() call in predict() function for logging.js integration
 * 2. Remove or refactor history.js to avoid conflicts with test.html
 * 3. Implement modelManager.js functions when model switching is needed
 * 4. Consider consolidating all subsystems into script.js for simplicity
 */
