// authController.js
const db = require("../config/db");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await db.execute("SELECT * FROM Users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = users[0];
    const passwordIsValid = await bcrypt.compare(password, user.password_hash);

    if (!passwordIsValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Set a secure, HTTP-only cookie with the user's id
    res.cookie("userId", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only set to true if you are using HTTPS in production
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.json({
      message: "Login successful",
      userId: user.id,
      name: user.first_name,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};
