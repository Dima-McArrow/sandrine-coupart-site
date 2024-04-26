const express = require('express');
const router = express.Router();
const dietController = require('../controllers/dietController');

router.get('/dietTypes', dietController.getDietTypes);

module.exports = router;
