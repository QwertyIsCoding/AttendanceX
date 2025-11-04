/**
 * @file script.js
 * @description Main script for AttendanceX. Handles Firebase configuration, webcam setup, 
 *              machine learning model integration, and user interactions.
 */

/**
 * @constant {Object} firebaseConfig
 * @description Firebase configuration object. Replace with your Firebase project details.
 */
const firebaseConfig = {
  // has been removed in the public repository for security reasons
};

/**
 * @constant {string} URL
 * @description URL of the Teachable Machine model used for image classification.
 */
const URL = "https://teachablemachine.withgoogle.com/models/M28B_0nhQ/";

let model, webcam, labelContainer, maxPredictions;

// data set
var listPresent = ["Null"];
var listAbsent = [];
var listStudents = []; // populate listStudents with the list of student names in the tensorflow model

/**
 * @function saveToCloud
 * @description Saves attendance data (present/absent lists, date, timestamp) to Firebase Firestore.
 * @returns {Promise<void>}
 */
async function saveToCloud() {
  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const db = firebase.firestore();

  // Get the current date and timestamp
  const now = new Date();
  const timestamp = now.toISOString();

  // Prepare the attendance data
  const attendanceData = {
    present: listPresent,
    absent: listAbsent,
    date: now.toDateString(),
    timestamp: timestamp
  };

  // Save the attendance data to Firestore
  try {
    await db.collection('attendance').doc(timestamp).set(attendanceData);
    console.log('Attendance data saved successfully');
  } catch (error) {
    console.error('Error saving attendance data: ', error);
  }
}

/**
 * @function breakCode
 * @description Stops code execution and clears the document content.
 * @returns {Promise<void>}
 */
async function breakCode() {
  // break camera too?
  document.removeEventListener("DOMContentLoaded", function () {}, false);
  document.removeEventListener("load", function () {}, false);
  document.write("");
}

/**
 * @function refresh
 * @description Reloads the current page.
 * @returns {void}
 */
async function refresh() {
  window.location.reload();
}

/**
 * @function init
 * @description Initializes the Teachable Machine model, sets up the webcam, and starts the prediction loop.
 * @returns {Promise<void>}
 */
async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Extract class names from metadata and populate listStudents
  const metadata = await fetch(metadataURL).then(response => response.json());
  listStudents = metadata.labels;

  // webcam
  const flip = true; // want to flip?
  webcam = new tmImage.Webcam(200, 200, flip);
  await webcam.setup(); // promp webcam access
  await webcam.play();
  window.requestAnimationFrame(loop);

  // append elements to the page
  document.getElementById("webcam-container").appendChild(webcam.canvas);
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    // and class labels
    labelContainer.appendChild(document.createElement("div"));
  }
}

/**
 * @function stopModel
 * @description Stops the webcam, unloads the model, and clears the label container.
 * @returns {Promise<void>}
 */
async function stopModel() {
  // Stop the webcam
  if (webcam) {
    webcam.stop();
    const webcamContainer = document.getElementById("webcam-container");
    if (webcamContainer && webcam.canvas) {
      webcamContainer.removeChild(webcam.canvas);
    }
    webcam = null;
  }

  // Unload the model
  if (model) {
    // Note: Teachable Machine's library doesn't have a built-in unload method
    // So we'll just set it to null to allow garbage collection
    model = null;
  }

  // Clear the label container
  if (labelContainer) {
    labelContainer.innerHTML = '';
  }

  // Stop the animation loop
  if (window.cancelAnimationFrame) {
    window.cancelAnimationFrame(animationFrame);
  }

  maxPredictions = 0;
}

/**
 * @function signUp
 * @description Creates a new user account using Firebase Authentication.
 * @returns {Promise<void>}
 */
async function signUp() {
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User signed up:', userCredential.user);
  } catch (error) {
    console.error('Error signing up:', error);
  }
}

/**
 * @function logIn
 * @description Signs in an existing user using Firebase Authentication.
 * @returns {Promise<void>}
 */
async function logIn() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User logged in:', userCredential.user);
  } catch (error) {
    console.error('Error logging in:', error);
  }
}

// Variable to store the animation frame ID
let animationFrame;

/**
 * @function loop
 * @description Continuously updates the webcam frame and runs predictions.
 * @returns {void}
 */
function loop() {
  // Your existing loop code here
  // ...

  // Store the animation frame ID
  animationFrame = window.requestAnimationFrame(loop);
}

/**
 * @function loop
 * @description Continuously updates the webcam frame and runs predictions.
 * @returns {void}
 */
async function loop() {
  webcam.update(); // update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
}

/**
 * @function showArray
 * @description Displays the list of present students on the page.
 * @returns {void}
 */
var myArray = [];
var present = [];
var indexes = [];
var index = 0;
function showArray() {
  document.body.innerHTML = ""; // needed
  for (let i = 0; i < myArray.length; i++) {
    if (myArray[i] != "Empty") {
      const newElement = document.createElement("p"); // needed
      newElement.textContent = myArray[i]; // needed
      //  present[i] = myArray[i];
      indexes[index] = i;
      index++;
      document.body.appendChild(newElement); // needed
    }
  }
}

/**
 * @function showAbsent
 * @description Displays the list of absent students on the page.
 * @returns {void}
 */
function showAbsent() {
  document.body.innerHTML = "";
  for (let i = 0; i < listStudents.length; i++) {
    if (present.indexOf(listStudents[i]) == -1) {
      const nextElement = document.createElement("p"); // try changing between a and p
      nextElement.textContent = listStudents[i];
      document.body.appendChild(nextElement);
    }
  }
}

/**
 * @function predict
 * @description Runs the webcam image through the Teachable Machine model and updates predictions.
 * @returns {Promise<void>}
 */
async function predict() {
  const prediction = await model.predict(webcam.canvas);
  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
      prediction[i].className + ": " + prediction[i].probability.toFixed(1);
    labelContainer.childNodes[i].innerHTML = classPrediction;
    if (prediction[i].probability.toFixed(2) > 0.9) {
      document.getElementById("constantData").innerHTML =
        prediction[i].className + ": " + prediction[i].probability.toFixed(2);
      myArray[i] = prediction[i].className;
      // add present array data here?
      present[i] = prediction[i].className;
    } else {
      document.getElementById("constantData").innerHTML = "I AM CONFUSED";
    }
    constantData.appendChild(document.createElement("div"));
    var myList = document.getElementById("myList");
    var list = document.getElementById("demo");

    // stack
    var firstname = (document.getElementById("constantData").innerHTML =
      prediction[i].className);
    var entry = document.createElement("li");
    if (prediction[i].probability.toFixed(2) > 0.9) {
      // parameter toFixed(x) --> significance?
      entry.appendChild(document.createTextNode(firstname)) +
        ": " +
        prediction[i].probability.toFixed(2);
      list.appendChild(entry);
    }
  }
}
