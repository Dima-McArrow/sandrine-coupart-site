const db = require("../config/db");

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
      };
    }

    const recipe = recipesMap[recipeId];

    // Avoiding duplicate entries for ingredients and steps
    if (
      row.ingredient_name &&
      !recipe.ingredients.find(
        (ing) =>
          ing.name === row.ingredient_name &&
          ing.quantity === row.ingredient_quantity &&
          ing.measure === row.ingredient_measure
      )
    ) {
      recipe.ingredients.push({
        name: row.ingredient_name,
        quantity: row.ingredient_quantity,
        measure: row.ingredient_measure,
      });
    }

    if (
      row.step_number &&
      !recipe.steps.find(
        (step) =>
          step.number === row.step_number &&
          step.instruction === row.step_instruction
      )
    ) {
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
