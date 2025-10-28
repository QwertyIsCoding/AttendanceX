/**
 * Logging Subsystem
 *
 * This subsystem handles data logging and export functionality for AttendanceX.
 * It collects prediction data with timestamps and provides export capabilities
 * for analysis and record-keeping.
 *
 * Features:
 * - Timestamped data collection for all predictions
 * - CSV-style text export of logged data
 * - Automatic cleanup of download resources
 * - Integration with UI export button
 */

// =============================================================================
// DATA LOGGING VARIABLES
// =============================================================================

/**
 * Array to store all collected prediction data.
 * Each entry contains timestamp, label (student name), and probability.
 * @type {Array<{timestamp: string, label: string, probability: number}>}
 */
let collectedData = [];

// =============================================================================
// DATA COLLECTION FUNCTIONS
// =============================================================================

/**
 * Collects prediction data with timestamp.
 * Called whenever new prediction data is available from the model.
 * Stores the data in the collectedData array for later export.
 *
 * @param {string} label - The predicted class/label (student name)
 * @param {number} probability - The prediction probability (0-1)
 * @function collectData
 * @returns {void}
 */
function collectData(label, probability) {
  const timestamp = new Date().toISOString();
  collectedData.push({
    timestamp: timestamp,
    label: label,
    probability: probability.toFixed(4) // Store with 4 decimal precision
  });
}

/**
 * Clears all collected data.
 * Useful for resetting the log between sessions or when starting fresh.
 *
 * @function clearCollectedData
 * @returns {void}
 */
function clearCollectedData() {
  collectedData = [];
  console.log("Collected data cleared");
}

/**
 * Gets the current count of logged data points.
 *
 * @function getDataCount
 * @returns {number} Number of data points collected
 */
function getDataCount() {
  return collectedData.length;
}

// =============================================================================
// DATA EXPORT FUNCTIONS
// =============================================================================

/**
 * Exports all collected data as a downloadable text file.
 * Creates a CSV-style format with timestamp, label, and probability.
 * Automatically triggers browser download and cleans up resources.
 *
 * @function exportData
 * @returns {void}
 * @throws {Error} If data export fails
 */
function exportData() {
  try {
    if (collectedData.length === 0) {
      alert("No data to export. Please run recognition first.");
      return;
    }

    // Create CSV header
    const header = "timestamp,label,probability\n";

    // Convert collected data to CSV format
    const dataString = collectedData
      .map((item) => `${item.timestamp},${item.label},${item.probability}`)
      .join("\n");

    const fullDataString = header + dataString;

    // Create a Blob with the data
    const blob = new Blob([fullDataString], { type: "text/csv" });

    // Create a download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance_data_${new Date().toISOString().split('T')[0]}.csv`;

    // Trigger the download (works in all modern browsers)
    document.body.appendChild(link);
    link.click();

    // Clean up resources
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log(`Exported ${collectedData.length} data points`);

  } catch (error) {
    console.error("Error exporting data:", error);
    alert("Failed to export data. Please try again.");
  }
}

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initializes the logging subsystem.
 * Sets up event listeners and prepares for data collection.
 * Called when the DOM is ready.
 *
 * @function initLogging
 * @returns {void}
 */
function initLogging() {
  // Set up the export button event listener
  const exportButton = document.getElementById("exportButton");
  if (exportButton) {
    exportButton.addEventListener("click", exportData);
    console.log("Logging subsystem initialized");
  } else {
    console.warn("Export button not found - logging subsystem not fully initialized");
  }
}

// Initialize when DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLogging);
} else {
  initLogging();
}

// =============================================================================
// INTEGRATION WITH MAIN SCRIPT
// =============================================================================

/*
 * How this subsystem integrates with script.js:
 *
 * 1. Data Collection:
 *    - logging.js collectData() should be called from script.js predict() function
 *    - Every prediction (high or low confidence) gets logged with timestamp
 *    - Currently NOT integrated - needs to be added to predict() function
 *
 * 2. Export Functionality:
 *    - exportData() is called from "Export" button in test.html
 *    - Button event listener is set up automatically on DOM load
 *    - No direct integration needed in script.js
 *
 * 3. Data Flow:
 *    - predict() in script.js should call collectData(label, probability)
 *    - User clicks "Export" button -> exportData() creates downloadable CSV
 *    - CSV includes all predictions with timestamps for analysis
 *
 * 4. Future Integration:
 *    - Add collectData() call to predict() function in script.js
 *    - Consider adding data clearing functionality to UI
 *    - Add data statistics (total predictions, unique students, etc.)
 */
