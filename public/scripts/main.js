document.addEventListener("DOMContentLoaded", async function () {
  console.info("DOM loaded");

  // Login and registration form handling
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      // Implement AJAX request for login
    });
  }

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();
      // Implement AJAX request for registration
    });
  }

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
      loginContainer.innerHTML = '<a href="login.html">Login</a>';
    }
  } catch (e) {
    console.error("Error parsing user data:", e);
    loginContainer.innerHTML = '<a href="login.html">Login</a>';
  }

  // Fetching and displaying testimonials
  const testimonialsContainer = document.querySelector(
    ".testims_cards_container"
  );
  try {
    const response = await fetch("api/testimonials");
    if (response.ok) {
      const testimonials = await response.json();
      testimonials.forEach((testimonial) => {
        const testimonialCard = document.createElement("div");
        testimonialCard.className = "testim_card";

        const testimonialText = document.createElement("p");
        testimonialText.className = "testim_text";
        testimonialText.textContent = `"${testimonial.testimonial}"`;

        const testimonialAuthor = document.createElement("p");
        testimonialAuthor.className = "testim_author";
        testimonialAuthor.textContent = `- ${testimonial.first_name}, ${testimonial.age} ans`;

        testimonialCard.appendChild(testimonialText);
        testimonialCard.appendChild(testimonialAuthor);

        testimonialsContainer.appendChild(testimonialCard);
      });
    } else {
      console.error("Failed to fetch testimonials:", response.status);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
});
