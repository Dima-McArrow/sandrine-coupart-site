const db = require("../config/db");

exports.getReviews = async (req, res) => {
  const recipeId = req.query.recipeId; // Get recipeId from query parameters
  const validated = req.query.validated; // Get validated status from query parameters

  let sql = `
    SELECT
      Reviews.id,
      Users.id as user_id,
      Users.first_name,
      Users.birth_date,
      Recipes.title as recipe_title,
      Recipes.id as recipe_id,
      Reviews.comment,
      Reviews.rating
    FROM
      Reviews
      JOIN Users ON Reviews.user_id = Users.id
      JOIN Recipes ON Reviews.recipe_id = Recipes.id
    WHERE
      Reviews.is_validated = TRUE
  `;

  if (recipeId) {
    sql += ` AND Reviews.recipe_id = ${db.escape(recipeId)}`; // Safely append recipe ID to SQL query
  }

  if (validated === "true") {
    sql += ` AND Reviews.is_validated = TRUE`; // Check for validated status
  }

  sql += `
    ORDER BY
      Reviews.created_at DESC
  `;

  try {
    const [reviews] = await db.execute(sql);
    res.json(reviews);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error retrieving reviews", error: error.message });
  }
};
