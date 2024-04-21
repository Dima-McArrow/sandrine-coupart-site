const db = require("../config/db");

exports.addTestimonial = async (req, res) => {
  const { user_id, testimonial } = req.body;

  try {
    await db.execute(
      "INSERT INTO Testimonials (user_id, testimonial) VALUES (?, ?)",
      [user_id, testimonial]
    );
    res.status(201).send({ message: "Testimonial added successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error adding testimonial", error: error.message });
  }
};

exports.getTestimonials = async (req, res) => {
  try {
    const [testimonials] = await db.execute("SELECT * FROM Testimonials");
    res.status(200).send(testimonials);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error retrieving testimonials", error: error.message });
  }
};
