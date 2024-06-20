// figurine model
 const URL = "https://teachablemachine.withgoogle.com/models/M28B_0nhQ/";
// https://teachablemachine.withgoogle.com/models/M28B_0nhQ/

//attempting to load model locally
// import * as tf from "@tensorflow/tfjs";

// const MODEL_PATH = "file:///C:/Users/12348/Desktop/AttendanceX/AttendanceX/CodeWeek/converted_edgetpu/model.json";
// const model = await tf.loadLayersModel(MODEL_PATH);

let model, webcam, labelContainer, maxPredictions;

// model = await.tf.loadLayersmodel("file:///C:/Users/12348/Desktop/AttendanceX/AttendanceX/CodeWeek/converted_edgetpu/model.json");
// data set
var listPresent = ["Null"];
var listAbsent = [];
var listStudents = ["Shifu", "WallE", "Mantis", "Po"];

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
        prediction[i].className;
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
      entry.appendChild(document.createTextNode(firstname));
      list.appendChild(entry);
    }
  }
}
