import express from "express";
import cors from "cors";
import morgan from "morgan";
import bcrypt from "bcryptjs";
import pkg from "pg";
const { Pool } = pkg;
const app = express();

app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "chat_app_db",
  password: "postgres",
  port: 5432,
});

app.get("/", (req, res) => {
  res.send("server working");
});

app.post("/users/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword],
    );
    res.status(201).json({ message: "user registered" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "user register error" });
  }
});

app.post("/users/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "invalid credentials" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "login error" });
  }
});

app.post("/messages/send", async (req, res) => {
  const { user_id, data } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO messages (user_id, data) VALUES ($1, $2) RETURNING *",
      [user_id, data],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "send message error" });
  }
});

app.get("/messages", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM messages ORDER BY id ASC");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "messages error" });
  }
});

export { pool };
export default app;
