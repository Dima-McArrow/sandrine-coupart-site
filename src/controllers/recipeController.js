const db = require("../config/db");

// Function to process rows into structured recipe data
function processRecipes(rows) {
  const recipesMap = {};

  rows.forEach((row) => {
    const recipeId = row.id;
    if (!recipesMap[recipeId]) {
      recipesMap[recipeId] = {
        id: recipeId,
        title: row.title,
        description: row.description,
        prep_time: row.prep_time,
        cook_time: row.cook_time,
        rest_time: row.rest_time,
        ingredients: [],
        steps: [],
        diet_types: new Set(),
        allergens: new Set(),
        image_url: row.image_url,
      };
    }

    const recipe = recipesMap[recipeId];

    // Check if ingredient is already added
    const ingredientExists = recipe.ingredients.some(
      (ing) =>
        ing.name === row.ingredient_name &&
        ing.quantity === row.ingredient_quantity &&
        ing.measure === row.ingredient_measure
    );
    if (row.ingredient_name && !ingredientExists) {
      recipe.ingredients.push({
        name: row.ingredient_name,
        quantity: row.ingredient_quantity,
        measure: row.ingredient_measure,
      });
    }

    // Check if step is already added
    const stepExists = recipe.steps.some(
      (step) =>
        step.number === row.step_number &&
        step.instruction === row.step_instruction
    );
    if (row.step_number && !stepExists) {
      recipe.steps.push({
        number: row.step_number,
        instruction: row.step_instruction,
      });
    }

    if (row.diet_type) {
      recipe.diet_types.add(row.diet_type);
    }

    if (row.allergen) {
      recipe.allergens.add(row.allergen);
    }
  });

  return Object.values(recipesMap).map((recipe) => ({
    ...recipe,
    diet_types: Array.from(recipe.diet_types),
    allergens: Array.from(recipe.allergens),
  }));
}

// Fetches all recipes
exports.getAllRecipes = async (req, res) => {
  try {
    const query = `
        SELECT 
            Recipes.id, 
            Recipes.title, 
            Recipes.description, 
            Recipes.prep_time, 
            Recipes.cook_time, 
            Recipes.rest_time,
            Recipes.image_url,
            Ingredients.name AS ingredient_name, 
            Ingredients.quantity AS ingredient_quantity, 
            Ingredients.measure_type AS ingredient_measure,
            Steps.step_number AS step_number, 
            Steps.instruction AS step_instruction,
            DietTypes.name AS diet_type, 
            Allergens.name AS allergen
        FROM Recipes
        LEFT JOIN Ingredients ON Recipes.id = Ingredients.recipe_id
        LEFT JOIN Steps ON Recipes.id = Steps.recipe_id
        LEFT JOIN RecipeDietTypes ON Recipes.id = RecipeDietTypes.recipe_id
        LEFT JOIN DietTypes ON RecipeDietTypes.diet_type_id = DietTypes.id
        LEFT JOIN RecipeAllergens ON Recipes.id = RecipeAllergens.recipe_id
        LEFT JOIN Allergens ON RecipeAllergens.allergen_id = Allergens.id
        ORDER BY Recipes.id, Steps.step_number;
    `;
    const [rows] = await db.execute(query);
    const recipes = processRecipes(rows);
    res.status(200).json(recipes);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error retrieving recipes", error: error.message });
  }
};

console.log("recipeController.js");

// Fetches a single recipe by ID
exports.getRecipeById = async (req, res) => {
  const recipeId = req.params.id;
  console.log("Fetching recipe with ID:", recipeId);
  if (!recipeId) {
    return res.status(400).send({ message: "Recipe ID is required" });
  }

  try {
    const query = `
      SELECT 
        Recipes.id, 
        Recipes.title, 
        Recipes.description, 
        Recipes.prep_time, 
        Recipes.cook_time, 
        Recipes.rest_time,
        Recipes.image_url,
        Ingredients.name AS ingredient_name, 
        Ingredients.quantity AS ingredient_quantity, 
        Ingredients.measure_type AS ingredient_measure,
        Steps.step_number AS step_number, 
        Steps.instruction AS step_instruction,
        DietTypes.name AS diet_type, 
        Allergens.name AS allergen
      FROM Recipes
      LEFT JOIN Ingredients ON Recipes.id = Ingredients.recipe_id
      LEFT JOIN Steps ON Recipes.id = Steps.recipe_id
      LEFT JOIN RecipeDietTypes ON Recipes.id = RecipeDietTypes.recipe_id
      LEFT JOIN DietTypes ON RecipeDietTypes.diet_type_id = DietTypes.id
      LEFT JOIN RecipeAllergens ON Recipes.id = RecipeAllergens.recipe_id
      LEFT JOIN Allergens ON RecipeAllergens.allergen_id = Allergens.id
      WHERE Recipes.id = ?
      ORDER BY Recipes.id, Steps.step_number;
    `;
    const [rows] = await db.execute(query, [recipeId]);

    if (rows.length === 0) {
      return res.status(404).send({ message: "Recipe not found" });
    }

    const recipes = processRecipes(rows);
    if (recipes.length > 0) {
      res.status(200).json(recipes[0]); // Return the first (and should be only) recipe
    } else {
      res.status(404).send({ message: "Recipe not found" });
    }
  } catch (error) {
    console.error("Error retrieving recipe:", error);
    res.status(500).send({
      message: "Failed to fetch recipe details",
      error: error.message,
    });
  }
};
