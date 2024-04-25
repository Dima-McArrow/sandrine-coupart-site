// reviewRoutes.js
const express = require("express");
const { getReviews } = require("../controllers/reviewController");
const router = express.Router();
const db = require("../config/db");

router.get("/reviews", getReviews);

router.post("/reviews", async (req, res) => {
  const { userId, recipeId, rating, comment } = req.body;

  // Basic validation
  if (!userId || !recipeId || !rating || typeof comment !== "string") {
    return res.status(400).send({ message: "Missing or invalid parameters" });
  }

  // Sanitize input to prevent XSS
  const sanitizedComment = comment.replace(/<[^>]*>?/gm, ""); // Remove any HTML tags

  console.log("userId:", userId);
  console.log("recipeId:", recipeId);
  console.log("rating:", rating);
  console.log("comment:", sanitizedComment);

  // Use prepared statements to prevent SQL injection
  try {
    const sql = `INSERT INTO Reviews (user_id, recipe_id, rating, comment) VALUES (?, ?, ?, ?)`;
    const [result] = await db.execute(sql, [
      userId,
      recipeId,
      rating,
      sanitizedComment,
    ]);
    res
      .status(201)
      .json({
        message: "Review added successfully",
        reviewId: result.insertId,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add review", error: error.message });
  }
});

module.exports = router;
