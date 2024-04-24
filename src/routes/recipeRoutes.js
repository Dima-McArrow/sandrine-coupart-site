// recipeRoutes.js
const express = require("express");
const { getAllRecipes, getRecipe } = require("../controllers/recipeController");
const router = express.Router();

router.get("/recipes", getAllRecipes);

module.exports = router;
