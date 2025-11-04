/**
 * @file logging.js
 * @description This module handles the collection and export of data related to camera observations.
 *              It provides methods to store labeled data with timestamps and export the data as a text file.
 */

/**
 * @constant {Array<Object>} collectedData
 * @description Stores the collected data. Each entry is an object containing:
 *              - `timestamp` {string}: The time the data was collected.
 *              - `label` {string}: The label associated with the data.
 *              - `probability` {number}: The probability score of the label.
 */
let collectedData = [];

/**
 * @function collectData
 * @description Adds a new data entry to the `collectedData` array with the current timestamp.
 * @param {string} label - The label associated with the data.
 * @param {number} probability - The probability score of the label.
 * @returns {void}
 */
function collectData(label, probability) {
  const timestamp = new Date().toISOString();
  collectedData.push({ timestamp, label, probability });
}

/**
 * @function exportData
 * @description Converts the collected data into a text file and triggers a download.
 *              The file is formatted with each entry as "timestamp, label, probability".
 * @returns {void}
 */
function exportData() {
  const dataString = collectedData.map(item => 
    `${item.timestamp}, ${item.label}, ${item.probability}`
  ).join('\n');

  const blob = new Blob([dataString], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'teachable_machine_data.txt';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * @description Binds the `exportData` function to the export button. When clicked,
 *              the collected data is exported as a text file.
 */
const exportButton = document.getElementById('exportButton');
exportButton.addEventListener('click', exportData);