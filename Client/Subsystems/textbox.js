/**
 * @file textbox.js
 * @description Handles the functionality for downloading text entered in a textarea as a file.
 */

/**
 * @function downloadFile
 * @description Creates a text file from the content of a textarea and triggers a download.
 * @returns {void}
 */
function downloadFile() {
    var textToWrite = document.getElementById("textArea").innerHTML;
    var textFileAsBlob = new Blob([textToWrite], { type: "text/plain" });
    var fileNameToSaveAs = "file.txt"; //filename.extension

    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
      // Chrome allows the link to be clicked without actually adding it to the DOM.
      downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
      // Firefox requires the link to be added to the DOM before it can be clicked.
      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
      downloadLink.onclick = destroyClickedElement;
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
    }

    downloadLink.click();
    var button = document.getElementById("save");
    button.addEventListener("click", saveTextAsFile);

    function destroyClickedElement(event) {
      // remove the link from the DOM
      document.body.removeChild(event.target);
    }
  }