// main.js

const config = {
  API_BASE_URL:
    window.location.hostname === "localhost" ? "http://localhost:3000" : "",
};

document.addEventListener("DOMContentLoaded", function () {
  console.info("DOM loaded");

  const currentPage = window.location.pathname;

  const loginContainer = document.getElementById("loginContainer");
  if (loginContainer) {
    updateUserStatus();
  }

  console.log("Current Page:", currentPage);

  // Fetch and display testimonials only on the index page
  if (
    currentPage.endsWith("index.html") ||
    currentPage === "/" ||
    currentPage === "" ||
    currentPage === "/public/HTML/"
  ) {
    fetchAndDisplayTestimonials();
    setInterval(fetchAndDisplayTestimonials, 600000); // Refresh every 10 minutes
  }
  if (document.querySelector(".recipes_common_wrapper")) {
    fetchAndDisplayRecipes(); // Call this function if we're on the recipes page
    setInterval(fetchAndDisplayRecipes, 300000);
  }

  const testimonialForm = document.getElementById("testimonialForm");
  if (testimonialForm) {
    testimonialForm.addEventListener("submit", handleTestimonialSubmit);
  }
});

function updateUserStatus() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const testimonialFormContainer = document.getElementById(
      "testimonialFormContainer"
    );
    if (user && user.userId) {
      displayLoggedInUser(user);
      if (testimonialFormContainer) {
        testimonialFormContainer.style.display = "block"; // Show the form
      }
    } else {
      displayLoginLink();
      if (testimonialFormContainer) {
        testimonialFormContainer.style.display = "none"; // Hide the form
      }
    }
  } catch (e) {
    console.error("Error parsing user data:", e);
    displayLoginLink();
    if (testimonialFormContainer) {
      testimonialFormContainer.style.display = "none";
    }
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
      linkA.style.color = "#609A7D";
    }
  }
}

console.info("fetchAndDisplayTestimonials function should start here");

async function fetchAndDisplayTestimonials() {
  const testimonialsContainer = document.querySelector(
    ".testims_cards_container"
  );
  if (testimonialsContainer) {
    console.log(
      "Fetching testimonials from:",
      `${config.API_BASE_URL}/api/testimonials`
    );
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/testimonials`);
      console.log("Response received:", response);
      if (response.ok) {
        const testimonials = await response.json();
        console.log("Testimonials:", testimonials);
        testimonialsContainer.innerHTML = ""; // Clear previous testimonials
        testimonials.forEach((testimonial) => {
          const testimonialCard = document.createElement("div");
          testimonialCard.className = "testim_card";
          testimonialCard.innerHTML = `<p class="testim_text">"${testimonial.testimonial}"</p><p class="testim_author">${testimonial.first_name}, ${testimonial.age} ans</p>`;
          testimonialsContainer.appendChild(testimonialCard);
        });
      } else {
        console.error(
          "Failed to fetch testimonials:",
          response.status,
          response.statusText
        );
        console.error("Response payload:", await response.text()); // To see the error message from the server
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  }
}

async function fetchAndDisplayRecipes() {
  const recipesContainer = document.querySelector(".recipes_container");
  const recipesUserContainer = document.getElementById("recipesUserList"); // Container for user-specific recipes
  fetchGeneralRecipes(recipesContainer); // Fetch general recipes for all users

  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.userId) {
    const userRecipesContainer = document.querySelector(".recipes_user_wrapper");
    const userRecipesPar = document.createElement("p");
    userRecipesPar.textContent = "Vos recettes personnalisées :";
    userRecipesContainer.prepend(userRecipesPar);
    fetchUserSpecificRecipes(recipesUserContainer, user.userId); // Fetch personalized recipes if user is logged in
  }
}

function fetchGeneralRecipes(container) {
  console.log(
    "Fetching general recipes from:",
    `${config.API_BASE_URL}/api/recipes`
  );
  fetch(`${config.API_BASE_URL}/api/recipes`)
    .then((response) =>
      response.ok ? response.json() : Promise.reject("Failed to load")
    )
    .then((recipes) => updateRecipesDisplay(container, recipes))
    .catch((error) => console.error("Error fetching general recipes:", error));
}

function fetchUserSpecificRecipes(container, userId) {
  console.log(
    "Fetching user-specific recipes from:",
    `${config.API_BASE_URL}/api/userRecipes/${userId}`
  );
  fetch(`${config.API_BASE_URL}/api/userRecipes/${userId}`)
    .then((response) =>
      response.ok ? response.json() : Promise.reject("Failed to load")
    )
    .then((recipes) => updateRecipesDisplay(container, recipes))
    .catch((error) =>
      console.error("Error fetching user-specific recipes:", error)
    );
}

function updateRecipesDisplay(container, recipes) {
  container.innerHTML = ""; // Clear previous content
  recipes.forEach((recipe) => {
    const recipeCard = createRecipeCard(recipe);
    container.appendChild(recipeCard);
  });
}

function createRecipeCard(recipe) {
  const recipeCard = document.createElement("div");
  recipeCard.className = "recipe_card";
  recipeCard.innerHTML = `
    <img class="recipe_card_image" src="${recipe.image_url}" alt="${recipe.title}">
    <h3 class="recipe_title">${recipe.title}</h3>
    <p class="recipe_description">${recipe.description}</p>
    <div class="recipe_card_button_wrapper">
      <input type="button" value="Details" class="recipe_card_button button_nutrition" onclick="window.location.href='recipe_details.html?id=${recipe.id}'">
    </div>
  `;
  return recipeCard;
}

const returnButton = document.querySelector(".button_return");
if (returnButton) {
  returnButton.addEventListener("click", function () {
    console.log("Return button clicked");
    window.location.href = "index.html";
  });
}

function getCookie(name) {
  let cookieArr = document.cookie.split(";");
  for (let i = 0; i < cookieArr.length; i++) {
    let cookiePair = cookieArr[i].split("=");
    if (name == cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  return null;
}

function handleTestimonialSubmit(e) {
  e.preventDefault();
  const testimonialText = document.getElementById("testimonialText").value;
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.userId) {
    fetch(`${config.API_BASE_URL}/api/testimonials`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.userId,
        testimonial: testimonialText,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Testimonial submitted!");
        document.getElementById("testimonialText").value = ""; // Clear the form
      })
      .catch((error) => console.error("Error submitting testimonial:", error));
  } else {
    alert("You must be logged in to submit a testimonial.");
  }
}
