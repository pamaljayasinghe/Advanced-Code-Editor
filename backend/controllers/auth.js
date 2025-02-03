const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../config/database");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Log the received credentials (remove in production)
    console.log("Login attempt:", { email });

    const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    // Log found users (remove in production)
    console.log("Found users:", users);

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);

    // Log password verification (remove in production)
    console.log("Password validation:", validPassword);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Send user data along with token
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

exports.register = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // Check if user already exists
    const [existingUsers] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
      [email, hashedPassword, name]
    );

    const token = jwt.sign(
      {
        id: result.insertId,
        email,
        name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: result.insertId,
        email,
        name,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// Add a test endpoint to verify user in database
exports.verifyUser = async (req, res) => {
  const { email } = req.query;

  try {
    const [users] = await db.execute(
      "SELECT id, email, name FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Server error during verification" });
  }
};
