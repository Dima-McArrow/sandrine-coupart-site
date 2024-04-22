document.addEventListener("DOMContentLoaded", function () {
  const returnButton = document.querySelector(".button_return");
  if (returnButton) {
    returnButton.addEventListener("click", function () {
      console.log("Return button clicked");
      window.location.href = "index.html";
    });
  }
})