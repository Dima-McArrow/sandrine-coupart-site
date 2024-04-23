// contact.js

document
  .getElementById("contactForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(this);

    fetch(this.action, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json()) // Always convert to JSON
      .then((data) => {
        if (data.redirect) {
          window.location.href = data.redirect;
        } else {
          throw new Error(data.message || "Unknown error occurred.");
        }
      })
      .catch((error) => {
        alert("Failed to send message: " + error.message);
      });
  });
