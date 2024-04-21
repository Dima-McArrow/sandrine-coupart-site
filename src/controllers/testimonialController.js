// testimonialController.js
const db = require("../config/db");

exports.getTestimonials = async (req, res) => {
  try {
    const [testimonials] = await db.execute(`
      SELECT 
        Testimonials.testimonial,
        Testimonials.created_at,
        Users.first_name,
        TIMESTAMPDIFF(YEAR, Users.birth_date, CURDATE()) AS age
      FROM Testimonials
      JOIN Users ON Testimonials.user_id = Users.id
      WHERE Testimonials.is_validated = TRUE
    `);
    res.json(testimonials);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error retrieving testimonials", error: error.message });
  }
};
