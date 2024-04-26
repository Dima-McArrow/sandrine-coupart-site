const db = require("../config/db");

exports.getAllergens = async (req, res) => {
  try {
    const [allergens] = await db.query("SELECT * FROM Allergens"); // Destructure to get rows
    res.json(allergens); // Send only the rows
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch allergens", error: error.message });
  }
};
