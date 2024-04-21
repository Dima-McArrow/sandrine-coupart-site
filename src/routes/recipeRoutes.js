const express = require("express");
const {
  addRecipe,
  getAllRecipes,
  getRecipe,
} = require("../controllers/recipeController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", protect, addRecipe);
router.get("/", getAllRecipes);
router.get("/:id", getRecipe);

module.exports = router;
