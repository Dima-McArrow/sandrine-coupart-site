// main.js
document.addEventListener("DOMContentLoaded", async function () {
  console.info("DOM loaded");

  

  // User login status and navigation update
  const loginContainer = document.getElementById("loginContainer");
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.name) {
      console.log("User logged in", user.name);
      loginContainer.innerHTML = "";

      const userNameDisplay = document.createElement("span");
      userNameDisplay.textContent = `${user.name} (connected) `;
      loginContainer.appendChild(userNameDisplay);

      const logoutButton = document.createElement("button");
      logoutButton.textContent = "Logout";
      logoutButton.onclick = function () {
        localStorage.removeItem("user");
        window.location.href = "login.html";
      };
      loginContainer.appendChild(logoutButton);
    } else {
      loginContainer.innerHTML = '<a href="login.html">Contact</a>';
    }
  } catch (e) {
    console.error("Error parsing user data:", e);
    loginContainer.innerHTML = '<a href="login.html">Contact</a>';
  }
  
});
