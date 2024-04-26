const db = require("../config/db");

exports.getDietTypes = async (req, res) => {
  try {
    // Destructure to directly capture the rows from the query result
    const [dietTypes] = await db.query("SELECT * FROM DietTypes");
    res.json(dietTypes); // Send only the rows, which should be an array of objects
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch diet types", error: error.message });
  }
};
