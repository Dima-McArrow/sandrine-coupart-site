// messageRoutes.js
const express = require("express");
const { body, validationResult } = require("express-validator");
const db = require("../config/db");
const multer = require("multer");
const upload = multer();

const router = express.Router();

console.log("messageRoutes.js");
// messageRoutes.js
router.post(
  "/contact",
  upload.none(), // Use this if you're not uploading files, or configure as needed
  [
    body("firstName").trim().escape(),
    body("lastName").trim().escape(),
    body("email").isEmail().normalizeEmail(),
    body("message").trim().escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { firstName, lastName, email, message } = req.body;
    const sql =
      "INSERT INTO Messages (first_name, last_name, email, message) VALUES (?, ?, ?, ?)";
    const values = [firstName, lastName, email, message];

    try {
      const [result] = await db.execute(sql, values);
      res.json({
        message: "Message submitted successfully!",
        redirect: "/ok.html"
      }); // Proper JSON response
    } catch (error) {
      console.error("Failed to insert into database:", error);
      res.status(500).json({ message: "Error submitting message" }); // Ensure JSON format in error response
    }
  }
);

module.exports = router;
