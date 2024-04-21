const express = require("express");
const router = express.Router();
const db = require("../db"); // Assuming you have a db module to handle SQL operations

// Endpoint to get validated testimonials
router.get("/", async (req, res) => {
  try {
    const { rows } = await db.query(
      "SELECT Testimonials.testimonial, Users.first_name, Users.last_name, Users.birth_date FROM Testimonials JOIN Users ON Testimonials.user_id = Users.id WHERE Testimonials.is_validated = TRUE ORDER BY Testimonials.created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
