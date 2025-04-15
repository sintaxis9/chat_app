// backend/src/controllers/userController.js
import bcrypt from "bcryptjs";
import { pool } from "../app.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Validar existencia previa
    const existsResult = await pool.query(
      "SELECT 1 FROM users WHERE email = $1",
      [email],
    );
    if (existsResult.rows.length) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, hashedPassword],
    );
    res.status(201).json({ message: "User registered" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );

    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      // Aquí luego generaremos JWT
      res.json({
        message: "Login successful",
        user: { id: user.id, name: user.name, email: user.email },
      });
    } else {
      // Registro implícito
      if (!name) {
        return res.status(400).json({ error: "Username required" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await pool.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
        [name, email, hashedPassword],
      );
      res.status(201).json({
        message: "User created",
        user: {
          id: newUser.rows[0].id,
          name: newUser.rows[0].name,
          email: newUser.rows[0].email,
        },
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const checkEmail = async (req, res) => {
  const { email } = req.query;
  try {
    const result = await pool.query(
      "SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)",
      [email],
    );
    res.json({ exists: result.rows[0].exists });
  } catch (error) {
    console.error("Check email error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
