/**
 * Textbox Subsystem
 *
 * This subsystem handles text export functionality for AttendanceX.
 * It provides utilities for downloading text content from textareas
 * as files, supporting both Chrome and Firefox browsers.
 *
 * Integration Notes:
 * - The downloadFile() function is called from the "Download File" button in test.html
 * - It reads content from the textarea with id "textArea"
 * - Creates a downloadable text file using the Blob API
 * - Handles browser-specific differences in download implementation
 */

// =============================================================================
// TEXT EXPORT FUNCTIONS
// =============================================================================

/**
 * Downloads the content of the textarea as a text file.
 * Creates a Blob from the textarea content and triggers a download.
 * Supports both Chrome (webkitURL) and Firefox (URL) implementations.
 *
 * @function downloadFile
 * @returns {void}
 * @throws {Error} If textarea element is not found or download fails
 */
function downloadFile() {
  try {
    // Get the text content from the textarea
    const textArea = document.getElementById("textArea");
    if (!textArea) {
      throw new Error("Textarea element 'textArea' not found");
    }

    const textToWrite = textArea.value || textArea.innerHTML;
    const fileNameToSaveAs = "attendance_notes.txt";

    // Create a Blob with the text content
    const textFileAsBlob = new Blob([textToWrite], { type: "text/plain" });

    // Create a temporary download link
    const downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";

    // Handle browser-specific URL creation
    if (window.webkitURL != null) {
      // Chrome and other webkit browsers
      downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
      // Firefox and other browsers
      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
      downloadLink.onclick = destroyClickedElement;
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
    }

    // Trigger the download
    downloadLink.click();

    // Clean up for Firefox
    if (window.webkitURL == null) {
      document.body.removeChild(downloadLink);
      window.URL.revokeObjectURL(downloadLink.href);
    }

  } catch (error) {
    console.error("Error downloading file:", error);
  }
}

/**
 * Legacy function name - kept for backward compatibility.
 * @deprecated Use downloadFile() instead
 * @function saveTextAsFile
 */
function saveTextAsFile() {
  // This function was referenced in the original code but not defined
  // Keeping for compatibility - calls the main downloadFile function
  downloadFile();
}

/**
 * Helper function to remove the download link from DOM after use.
 * Used specifically for Firefox compatibility.
 *
 * @param {Event} event - The click event on the download link
 * @function destroyClickedElement
 * @private
 */
function destroyClickedElement(event) {
  // Remove the link from the DOM to clean up
  document.body.removeChild(event.target);
}

// =============================================================================
// INTEGRATION WITH MAIN SCRIPT
// =============================================================================

/*
 * How this subsystem integrates with script.js and test.html:
 *
 * 1. Function Availability:
 *    - downloadFile() is available globally when textbox.js is loaded
 *    - Called directly from onclick handler in test.html button
 *
 * 2. UI Integration:
 *    - test.html includes a textarea with id "textArea"
 *    - "Download File" button calls downloadFile() onclick
 *    - No direct integration needed in script.js
 *
 * 3. Data Flow:
 *    - User enters text in textarea
 *    - downloadFile() reads textarea.value or innerHTML
 *    - Creates Blob and triggers browser download
 *    - File is saved as "attendance_notes.txt"
 *
 * 4. Browser Compatibility:
 *    - Handles webkitURL (Chrome/Safari) vs URL (Firefox) differences
 *    - Graceful fallback for different browser implementations
 */
