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

exports.register = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const {
      firstName,
      lastName,
      birthday,
      email,
      password,
      dietTypes,
      allergens,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const [userResult] = await connection.query(
      "INSERT INTO Users (first_name, last_name, birth_date, email, password_hash) VALUES (?, ?, ?, ?, ?)",
      [firstName, lastName, birthday, email, hashedPassword]
    );
    const userId = userResult.insertId;
    console.log("User created with ID:", userId);

    if (dietTypes && dietTypes.length) {
      for (const dietType of dietTypes) {
        await connection.query(
          "INSERT INTO UserDietTypes (user_id, diet_type_id) VALUES (?, ?)",
          [userId, dietType]
        );
      }
    }

    if (allergens && allergens.length) {
      for (const allergen of allergens) {
        await connection.query(
          "INSERT INTO UserAllergens (user_id, allergen_id) VALUES (?, ?)",
          [userId, allergen]
        );
      }
    }

    await connection.commit();
    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};
