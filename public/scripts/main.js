document.addEventListener("DOMContentLoaded", function () {
  console.info("DOM loaded");

  const currentPage = window.location.pathname;

  // Handle login and registration forms only on specific pages
  if (
    currentPage.endsWith("login.html") ||
    currentPage.endsWith("register.html")
  ) {
    handleLoginForm();
    handleRegisterForm();
  }

  // Update user login status on all pages
  updateUserStatus();

  // Fetch and display testimonials only on the index page
  if (
    currentPage.endsWith("index.html") ||
    currentPage === "/" ||
    currentPage === ""
  ) {
    fetchAndDisplayTestimonials();
    setInterval(fetchAndDisplayTestimonials, 600000); // Refresh every 10 minutes
  }
});

function handleLoginForm() {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      // Implement AJAX request for login
    });
  }
}

function handleRegisterForm() {
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();
      // Implement AJAX request for registration
    });
  }
}

function updateUserStatus() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.name) {
      displayLoggedInUser(user);
    } else {
      displayLoginLink();
    }
  } catch (e) {
    console.error("Error parsing user data:", e);
    displayLoginLink();
  }
}

function displayLoggedInUser(user) {
  const loginContainer = document.getElementById("loginContainer");
  loginContainer.innerHTML = `<span class="user_name">${user.name} 🟢</span>`;

  const logoutButton = document.createElement("button");
  logoutButton.textContent = "Logout";
  logoutButton.classList.add("logout_button");
  logoutButton.onclick = function () {
    localStorage.removeItem("user");
    window.location.href = "login.html";
  };
  loginContainer.appendChild(logoutButton);
}

function displayLoginLink() {
  const loginContainer = document.getElementById("loginContainer");
  loginContainer.innerHTML = '<a href="login.html">Login</a>';
  styleLoginLinkOnLoginPage();
}

function styleLoginLinkOnLoginPage() {
  const currentPage = window.location.pathname;
  if (currentPage.endsWith("login.html")) {
    const linkA = document.querySelector("#loginContainer a");
    if (linkA) {
      linkA.style.color = "#609A7D"; // Apply the style directly
    }
  }
}

async function fetchAndDisplayTestimonials() {
  const testimonialsContainer = document.querySelector(
    ".testims_cards_container"
  );
  if (testimonialsContainer) {
    try {
      const response = await fetch("/api/testimonials");
      if (response.ok) {
        const testimonials = await response.json();
        testimonialsContainer.innerHTML = ""; // Clear previous testimonials
        testimonials.forEach((testimonial) => {
          const testimonialCard = document.createElement("div");
          testimonialCard.className = "testim_card";
          testimonialCard.innerHTML = `<p class="testim_text">"${testimonial.testimonial}"</p><p class="testim_author">- ${testimonial.first_name}, ${testimonial.age} ans</p>`;
          testimonialsContainer.appendChild(testimonialCard);
        });
      } else {
        console.error("Failed to fetch testimonials:", response.status);
      }
    } catch (error) {
      console.error("Network error while fetching testimonials:", error);
    }
  }
}

const returnButton = document.querySelector(".button_return");
if (returnButton) {
  returnButton.addEventListener("click", function () {
    console.log("Return button clicked");
    window.location.href = "index.html";
  });
}
