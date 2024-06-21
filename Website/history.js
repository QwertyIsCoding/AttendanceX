var goBack = document.createElement("BUTTON");
  document.body.appendChild(goBack);
  goBack.addEventListener("click", function () {
    // This code will be executed when the button is clicked
    history.back();
  });