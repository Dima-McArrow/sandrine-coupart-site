// testimonialRoutes.js
const express = require('express');
const { getTestimonials } = require('../controllers/testimonialController');
const router = express.Router();

router.get('/testimonials', getTestimonials);

module.exports = router;
