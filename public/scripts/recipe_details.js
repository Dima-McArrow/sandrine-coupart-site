const config = {
  API_BASE_URL:
    window.location.hostname === "localhost" ? "http://localhost:3000" : "",
};

window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get("id"); // Assuming the URL is like ?id=40

  if (recipeId) {
    fetch(`${config.API_BASE_URL}/api/recipes/${recipeId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Recipe details:", data);
        document.title = data.title;
        document.getElementById("recipeDetailContainer").innerHTML = `
              <h1>${data.title}</h1>
              <img class="recipe_details_pic" src="${data.image_url}" alt="${
          data.title
        }"><p>${data.description}</p>
        <h2>Preparation Time</h2><p>${data.prep_time}</p>
        <h2>Cook Time</h2><p>${data.cook_time}</p>
        <h2>Rest Time</h2><p>${data.rest_time}</p>
        <h2>Ingredients</h2>
        
        <ul>${data.ingredient}</ul><h2>Steps</h2><ol>${data.steps}</ol>
        <h2>Diet Types</h2><ul>${data.diet_types}</ul><h2>Allergens</h2><ul>${data.allergens}</ul>
        `;
      })
      .catch((error) => {
        console.error("Failed to fetch recipe details:", error);
        document.getElementById("recipeDetailContainer").innerHTML =
          "Failed to load data.";
      });
  } else {
    document.getElementById("recipeDetailContainer").innerHTML =
      "No recipe ID provided.";
  }
};

document
  .querySelector(".button_return_to_recipes")
  .addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = "recipes.html";
  });
