// keep track of all data seen by camera
// Initialize variables to store collected data
// Initialize variables to store collected data
let collectedData = [];

// Function to collect data (call this whenever new data is available)
function collectData(label, probability) {
  const timestamp = new Date().toISOString();
  collectedData.push({ timestamp, label, probability });
}

// Function to export data as a text file
function exportData() {
  // Convert collected data to a string
  const dataString = collectedData.map(item => 
    `${item.timestamp}, ${item.label}, ${item.probability}`
  ).join('\n');

  // Create a Blob with the data
  const blob = new Blob([dataString], { type: 'text/plain' });

  // Create a download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'teachable_machine_data.txt';

  // Trigger the download
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Set up the export button
const exportButton = document.getElementById('exportButton');
exportButton.addEventListener('click', exportData);