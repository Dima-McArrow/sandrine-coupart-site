// login.js
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        console.log("Login successful", userData);
        localStorage.setItem("user", JSON.stringify(userData)); // Store user data including name
        window.location.href = "index.html"; // Redirect to home page
      } else {
        console.error("Failed to login:", response.status);
        // Handle errors, show user feedback
      }
    } catch (error) {
      console.error("Network error:", error);
      // Handle network errors or CORS issues
    }
  });
});
