const express = require("express");
const path = require("path");

const {
  getAllRecipes,
  getRecipeById,
  getUserSpecificRecipes,
} = require("../controllers/recipeController");
const router = express.Router();

router.get("/recipes", getAllRecipes);

router.get("/recipes/:id", getRecipeById);

router.get("/userRecipes/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const recipes = await getUserSpecificRecipes(userId);
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
