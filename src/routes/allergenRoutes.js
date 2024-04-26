const express = require("express");
const router = express.Router();
const allergenController = require("../controllers/allergenController");

router.get("/allergens", allergenController.getAllergens);

module.exports = router;
