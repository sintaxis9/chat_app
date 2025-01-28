import express from "express";
import cors from "cors";
import morgan from "morgan";
import { Pool } from "pg";

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
  const { name, email } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "user register error" });
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

export default app;
