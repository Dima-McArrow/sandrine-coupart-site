// testimonialRoutes.js
const express = require('express');
const { getTestimonials } = require('../controllers/testimonialController');
const router = express.Router();
const db = require("../config/db");

router.get('/testimonials', getTestimonials);

// testimonialRoutes.js
router.post('/testimonials', async (req, res) => {
  const { userId, testimonial } = req.body;
  if (!userId || !testimonial) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const sql = `INSERT INTO Testimonials (user_id, testimonial, is_validated) VALUES (?, ?, ?)`;
    const [result] = await db.execute(sql, [userId, testimonial, false]); // Set is_validated to false initially
    res.status(201).json({ message: "Testimonial added successfully", testimonialId: result.insertId, });
  } catch (error) {
    res.status(500).json({ message: "Failed to add testimonial", error: error.message });
  }
});

module.exports = router;
