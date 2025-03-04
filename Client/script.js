// firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmuniK3qPkWT64UfPcUnerR2TnBTqoxo0",
  authDomain: "attendance-4bfda.firebaseapp.com",
  projectId: "attendance-4bfda",
  storageBucket: "attendance-4bfda.firebasestorage.app",
  messagingSenderId: "984620523158",
  appId: "1:984620523158:web:1cecf2e6af63f06212acb7",
  measurementId: "G-BVBTVTJE36"
};

// figurine model
const URL = "https://teachablemachine.withgoogle.com/models/M28B_0nhQ/";
// https://teachablemachine.withgoogle.com/models/M28B_0nhQ/

//attempting to load model locally
// import * as tf from "@tensorflow/tfjs";
// const MODEL_PATH = "file:///C:/Users/12348/Desktop/AttendanceX/AttendanceX/CodeWeek/converted_edgetpu/model.json";
// const model = await tf.loadLayersModel(MODEL_PATH);

let model, webcam, labelContainer, maxPredictions;

// data set
var listPresent = ["Null"];
var listAbsent = [];
var listStudents = []; // populate listStudents with the list of student names in the tensorflow model

// save to firestone feature -- along with the date of the attendance with timestamp as the filename
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
 
// break button -- stop code execution
async function breakCode() {
  // break camera too?
  document.removeEventListener("DOMContentLoaded", function () {}, false);
  document.removeEventListener("load", function () {}, false);
  document.write("");
}

async function refresh() {
  window.location.reload();
}

// Load the image model and setup the webcam
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

// Function to stop the webcam and unload the model
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

// Sign up function
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

// Log in function
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

// Modified loop function to store the animation frame ID
function loop() {
  // Your existing loop code here
  // ...

  // Store the animation frame ID
  animationFrame = window.requestAnimationFrame(loop);
}

// looping -- keep track
async function loop() {
  webcam.update(); // update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
}

// show present
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

// run the webcam image through the image model
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
