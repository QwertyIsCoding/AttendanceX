# AttendanceX

<p align="center">
  <img src="https://github.com/QwertyIsCoding/AttendanceX/blob/main/Assets/attendance-x.png?raw=true" alt="A new way to take roll in class"/>
</p>

## Description

AttendanceX is a machine learning-based attendance tracking system that uses webcam recognition to identify students in real-time. Originally developed as an AP Computer Science A project, it leverages Google's Teachable Machine for image classification and Firebase for cloud storage and authentication. The system captures webcam footage, predicts student identities based on a trained model, and maintains lists of present and absent students. Attendance data can be saved to the cloud with timestamps and exported locally.

## Project Future

This project is currently the framework for much bigger software. Future plans include implementing with [Numerosity](https://numerosity.pages.dev).

## Features

- **Real-time Student Recognition**: Uses a pre-trained Teachable Machine image model to classify students via webcam.
- **Attendance Tracking**: Automatically categorizes students as present or absent based on predictions.
- **Cloud Storage**: Integrates with Firebase Firestore to save attendance records with timestamps.
- **User Authentication**: Sign-up and log-in functionality using Firebase Authentication.
- **Data Export**: Export collected prediction data as a text file.
- **Webcam Control**: Start, stop, and manage webcam feed.
- **Modular Subsystems**: Organized code structure with separate modules for history, logging, model management, and text handling.
- **Responsive UI**: Simple HTML interface with buttons for all major functions.

## How It Works

1. **Model Loading**: The application loads a Teachable Machine image model from a specified URL (currently set to a public model). The model is trained to recognize student faces or identifiers.

2. **Webcam Setup**: Upon initialization, the app requests webcam access and starts capturing frames.

3. **Prediction Loop**: In a continuous loop, the webcam frame is fed into the model for prediction. Each prediction includes class names (student names) and probabilities.

4. **Attendance Logic**: If a prediction exceeds a confidence threshold (90%), the student is marked as present. The system maintains arrays for present and absent students.

5. **Data Collection**: All predictions are logged with timestamps for potential export.

6. **Cloud Saving**: Attendance data (present/absent lists, date, timestamp) can be saved to Firebase Firestore.

7. **User Interaction**: Users can view present/absent lists, export data, stop the model, or refresh the page.

The system uses TensorFlow.js and the Teachable Machine library for client-side machine learning, ensuring privacy by processing everything locally except for cloud storage.

## Setup and Installation

### Prerequisites

- A modern web browser with webcam support (Chrome, Firefox, etc.)
- Internet connection for loading libraries and Firebase
- Firebase project (see below)

### Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/).
2. Enable Firestore and Authentication in your Firebase project.
3. Copy your Firebase config from the project settings and update the following files:
   - `Client/Firebase/firebase-config.js`: Replace the `firebaseConfig` object.
   - `Client/script.js`: Replace the empty `firebaseConfig` object (lines 2-4).
4. Update `Client/Firebase/firestone.rules` if you need custom security rules (currently allows all read/write for simplicity).

### Running the Application

1. Clone this repository:
   ```
   git clone https://github.com/QwertyIsCoding/AttendanceX.git
   cd AttendanceX
   ```

2. Open `Client/test.html` in your web browser. No server is required as it's a client-side application.

3. If needed, serve the files locally (e.g., using Python's HTTP server):
   ```
   cd Client
   python -m http.server 8000
   ```
   Then open `http://localhost:8000/test.html`.

### Model Setup

The current model is loaded from `https://teachablemachine.withgoogle.com/models/M28B_0nhQ/`. To use your own model:

1. Train a model on [Teachable Machine](https://teachablemachine.withgoogle.com/).
2. Export the model and host it publicly.
3. Update the `URL` variable in `Client/script.js` (line 7).

Pre-converted EdgeTPU models are available in the `Models/converted_edgetpu/` directory for potential future use with hardware acceleration.

## Usage

1. **Authentication**: Use the sign-up or log-in forms to authenticate with Firebase.

2. **Start Recognition**: Click "Start" to initialize the model and webcam. Grant camera permissions when prompted.

3. **Monitor Predictions**: View real-time predictions in the label container. High-confidence detections (>90%) are highlighted.

4. **View Attendance**:
   - Click "Show Present" to display detected students.
   - Click "Show Absent" to display students not detected (based on model labels).

5. **Save Data**: Click "SaveToFirebase" to upload attendance data to Firestore.

6. **Export Data**: Click "Export" to download logged prediction data as a text file.

7. **Control**:
   - "Stop" to halt webcam and model.
   - "Break" to clear the page.
   - "Refresh" to reload.
   - "Go Back" to navigate browser history.

8. **Download Text**: Enter text in the textarea and click "save File" to download as a text file.

## Function Reference

### Main Script (`Client/script.js`)

- **`saveToCloud()`**: Initializes Firebase (if not already), prepares attendance data with present/absent lists, date, and timestamp, and saves to Firestore collection "attendance".
- **`breakCode()`**: Removes event listeners and clears the document to stop execution.
- **`refresh()`**: Reloads the current page.
- **`init()`**: Loads the Teachable Machine model and metadata, populates student list, sets up webcam, and starts the prediction loop.
- **`stopModel()`**: Stops the webcam, removes canvas, unloads model, clears labels, and cancels animation frame.
- **`signUp()`**: Creates a new user account using Firebase Authentication with email and password.
- **`logIn()`**: Signs in an existing user using Firebase Authentication.
- **`loop()`**: Updates webcam frame, runs prediction, and requests next animation frame.
- **`showArray()`**: Displays present students by creating paragraph elements for non-"Empty" detections.
- **`showAbsent()`**: Displays absent students by checking which model labels are not in the present list.
- **`myFunction()`**: Creates and appends a "Click me" button to the document body (appears unused).
- **`predict()`**: Runs model prediction on webcam canvas, updates labels, handles high-confidence detections, and appends to lists.

### Subsystems

#### `Client/Subsystems/history.js`
- **Anonymous function on `goBack` click**: Navigates back in browser history.

#### `Client/Subsystems/logging.js`
- **`collectData(label, probability)`**: Adds timestamped prediction data to `collectedData` array.
- **`exportData()`**: Converts collected data to string, creates a downloadable text file "teachable_machine_data.txt".

#### `Client/Subsystems/modelManager.js`
- (Empty file) - Placeholder for future model upload/removal functionality using Teachable Machine or TensorFlow links.

#### `Client/Subsystems/textbox.js`
- **`downloadFile()`**: Downloads the content of the textarea as "file.txt".

### Styles
- `Client/Styles/Background.css`: (Empty) - For background styling.
- `Client/Styles/Buttons.css`: (Empty) - For button styling.
- `Client/Styles/Layout.css`: (Empty) - For layout styling.
- `Client/Styles/Themes/`: Contains theme files (darkMode.css, highContrast.css, lightMode.css) - Currently empty.

## Dependencies

- **TensorFlow.js**: `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js`
- **Teachable Machine Image**: `https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js`
- **Firebase**: Imported in `firebase-config.js` and used in `script.js`

## Project Structure

```
AttendanceX/
├── Assets/                          # Images and logos
├── Client/                          # Web application
│   ├── Database/                    # Local data storage (settings, user data)
│   ├── Firebase/                    # Firebase configuration and rules
│   ├── script.js                    # Main application logic
│   ├── style.css                    # Basic styling
│   ├── test.html                    # Main HTML interface
│   ├── Styles/                      # Organized CSS files
│   └── Subsystems/                  # Modular JavaScript components
├── Models/                          # Pre-trained ML models
│   └── converted_edgetpu/           # EdgeTPU-compatible model files
├── LICENSE                          # Project license
└── README.md                        # This file
```

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests. For major changes, open an issue first to discuss.

## License

This project is licensed under the terms specified in the LICENSE file.

## Documentation

This project is thoroughly documented to help users and developers understand its functionality. Each file in the project contains inline comments and JSDoc-style annotations to explain its purpose, functions, and usage. Refer to the source code for detailed insights into the implementation.