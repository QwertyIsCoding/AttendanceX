/**
 * History Subsystem
 *
 * This subsystem handles browser navigation functionality for AttendanceX.
 * It provides a simple way to navigate back in browser history,
 * useful for returning to previous pages or states.
 *
 * Note: This subsystem creates a button programmatically and appends it to the DOM.
 * In the current implementation, this may conflict with the modern HTML structure
 * where navigation is handled by the "Go Back" button in test.html.
 */

// =============================================================================
// NAVIGATION FUNCTIONS
// =============================================================================

/**
 * Creates and appends a "Go Back" button to the document body.
 * The button allows users to navigate back in browser history.
 * This function is called automatically when the script loads.
 *
 * @function createGoBackButton
 * @returns {void}
 */
function createGoBackButton() {
  // Create the button element
  const goBackButton = document.createElement("button");
  goBackButton.textContent = "Go Back";
  goBackButton.id = "history-go-back-btn";
  goBackButton.className = "btn btn-secondary";

  // Add click event listener
  goBackButton.addEventListener("click", function() {
    try {
      // Navigate back in browser history
      window.history.back();
    } catch (error) {
      console.error("Error navigating back:", error);
      // Fallback: could redirect to a specific page if needed
    }
  });

  // Append to document body
  document.body.appendChild(goBackButton);

  console.log("History navigation button created");
}

/**
 * Programmatically navigates back in browser history.
 * Alternative function that can be called directly without creating a button.
 *
 * @function goBack
 * @returns {void}
 */
function goBack() {
  try {
    window.history.back();
  } catch (error) {
    console.error("Error navigating back:", error);
  }
}

/**
 * Navigates forward in browser history.
 * Provided for completeness, though less commonly needed.
 *
 * @function goForward
 * @returns {void}
 */
function goForward() {
  try {
    window.history.forward();
  } catch (error) {
    console.error("Error navigating forward:", error);
  }
}

/**
 * Goes to a specific point in history.
 * @param {number} delta - Number of pages to go back (negative) or forward (positive)
 * @function goToHistory
 * @returns {void}
 */
function goToHistory(delta) {
  try {
    window.history.go(delta);
  } catch (error) {
    console.error("Error navigating in history:", error);
  }
}

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initializes the history subsystem.
 * Creates the navigation button when the DOM is ready.
 *
 * @function initHistory
 * @returns {void}
 */
function initHistory() {
  // Wait for DOM to be ready before creating button
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createGoBackButton);
  } else {
    createGoBackButton();
  }
}

// Initialize the subsystem
initHistory();

// =============================================================================
// INTEGRATION WITH MAIN SCRIPT AND HTML
// =============================================================================

/*
 * How this subsystem integrates with script.js and test.html:
 *
 * 1. Dual Implementation:
 *    - history.js creates a button programmatically and appends it to body
 *    - test.html also has a "Go Back" button that calls history.back() onclick
 *    - This creates duplicate functionality - one should be removed
 *
 * 2. Recommended Approach:
 *    - Remove the programmatic button creation from history.js
 *    - Keep the button in test.html for better UI control
 *    - Use goBack() function if programmatic navigation is needed
 *
 * 3. Function Availability:
 *    - goBack(), goForward(), goToHistory() are available globally
 *    - Can be called from script.js or other subsystems if needed
 *
 * 4. Current Issues:
 *    - Button is appended to body without proper styling or positioning
 *    - May conflict with the modern layout in test.html
 *    - Consider removing this subsystem or refactoring to utility functions
 *
 * 5. Future Integration:
 *    - If keeping, style the button to match the UI theme
 *    - Position it properly in the layout
 *    - Or remove and rely solely on test.html button
 */
