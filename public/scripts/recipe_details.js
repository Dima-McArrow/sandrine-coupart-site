const config = {
  API_BASE_URL:
    window.location.hostname === "localhost" ? "http://localhost:3000" : "",
};

window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get("id"); // Assuming the URL is like ?id=40

  // Load the recipe details
  if (recipeId) {
    fetch(`${config.API_BASE_URL}/api/recipes/${recipeId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Recipe details:", data);
        document.title = data.title;
        const recipeContainer = document.getElementById(
          "recipeDetailContainer"
        );
        recipeContainer.innerHTML = `
          <h1>${data.title}</h1>
          <img class="recipe_details_pic" src="${data.image_url}" alt="${data.title}">
          <p>${data.description}</p>
          <h2>Preparation Time</h2><p>${data.prep_time} min</p>
          <h2>Cook Time</h2><p>${data.cook_time} min</p>
          <h2>Rest Time</h2><p>${data.rest_time} min</p>
          <h2>Ingredients</h2>
        `;
        const ingredientsList = document.createElement("ul");
        data.ingredients.forEach((ingredient) => {
          const ingredientItem = document.createElement("li");
          ingredientItem.textContent =
            ingredient.name +
            ": " +
            ingredient.quantity +
            " " +
            ingredient.measure;
          ingredientsList.appendChild(ingredientItem);
        });
        recipeContainer.appendChild(ingredientsList);

        const stepsList = document.createElement("ul");
        data.steps.forEach((step) => {
          const stepItem = document.createElement("li");
          stepItem.textContent = step.number + ": " + step.instruction;
          stepsList.appendChild(stepItem);
        });
        recipeContainer.appendChild(stepsList);
      })
      .catch((error) => {
        console.error("Failed to fetch recipe details:", error);
        document.getElementById("recipeDetailContainer").innerHTML =
          "Failed to load data.";
      });

    // Load the reviews
    fetch(
      `${config.API_BASE_URL}/api/reviews?recipeId=${recipeId}&validated=true`
    )
      .then((response) => response.json())
      .then((data) => {
        const reviewsContainer = document.getElementById("reviewsContainer");
        reviewsContainer.innerHTML = ""; // Clear previous content
        data.forEach((review) => {
          const reviewElement = document.createElement("div");
          reviewElement.className = "review";

          // Create an image element for the rating
          const image = document.createElement("img");
          image.alt = `${review.rating} stars`;
          image.style.width = "100px";

          // Correct usage of review.rating in the switch statement
          switch (review.rating) {
            case 5:
              image.src = "../../media/5of5.png"; // For the highest rating
              break;
            case 4:
              image.src = "../../media/4of5.png";
              break;
            case 3:
              image.src = "../../media/3of5.png";
              break;
            case 2:
              image.src = "../../media/2of5.png";
              break;
            case 1:
              image.src = "../../media/1of5.png"; // For the lowest rating
              break;
            default:
              image.src = "default.png"; // Handle cases where rating might be outside expected values
              break;
          }

          // Construct the review HTML
          reviewElement.innerHTML = `
            <h3>${review.first_name}</h3>
            <p>${review.comment}</p>
        `;

          // Append the image to the review element
          reviewElement.appendChild(image);

          // Append the review element to the container
          reviewsContainer.appendChild(reviewElement);
        });
      })
      .catch((error) => {
        console.error("Failed to fetch reviews:", error);
        document.getElementById("reviewsContainer").innerHTML =
          "Failed to load data.";
      });

    // Check if the user is logged in to display the review form
    const user = getUser();
    console.log("User data:", user);
    if (user && user.userId) {
      document.getElementById("reviewFormContainer").style.display = "block";
      document.getElementById("userId").value = user.userId;
      document.getElementById("recipeId").value = recipeId;
    } else {
      document.getElementById("reviewFormContainer").style.display = "none";
    }
  } else {
    document.getElementById("recipeDetailContainer").innerHTML =
      "No recipe ID provided.";
  }

  document
    .querySelector(".button_return_to_recipes")
    .addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = "recipes.html";
    });

  document
    .getElementById("reviewForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const reviewData = {
        userId: document.getElementById("userId").value,
        recipeId: document.getElementById("recipeId").value,
        rating: document.getElementById("rating").value,
        comment: document.getElementById("comment").value,
      };
      fetch(`${config.API_BASE_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      })
        .then((response) => response.json())
        .then((data) => {
          alert("Review submitted!");
          location.reload(); // Reload the page to update the review list
        })
        .catch((error) => console.error("Error submitting review:", error));
    });
};

function getUser() {
  // This function should retrieve user data from local storage or a cookie
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch (error) {
    console.error("Failed to retrieve user data:", error);
    return null;
  }
}
