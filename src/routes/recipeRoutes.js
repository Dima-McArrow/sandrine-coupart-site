// recipeRoutes.js
const express = require("express");
const { getAllRecipes, getRecipe } = require("../controllers/recipeController");
const router = express.Router();

router.get("/", getAllRecipes);
// router.get("/:id", getRecipe); // Ensure getRecipe is defined or remove this if not needed

module.exports = router;
