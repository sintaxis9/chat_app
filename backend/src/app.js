import express from "express";
import cors from "cors";
import morgan from "morgan";
import bcrypt from "bcryptjs";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import pkg from "pg";
const { Pool } = pkg;
const app = express();

import { dotenv } from "dotenv";
dotenv.config();

app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "db",
  database: process.env.DB_NAME || "chat_app_db",
  password: process.env.DB_PASSWORD || "postgres",
  port: 5432,
});

app.get("/", (req, res) => res.send("server working"));

app.use("/users", userRoutes);
app.use("/messages", messageRoutes);

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
  const { email, password, name } = req.body;
  console.log("data received:", { email, password, name });

  try {
    console.log("searching user...");
    const userResult = await pool.query(
      "SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)",
      [email],
    );

    if (userResult.rows.length > 0) {
      console.log("user find: ", userResult.rows[0]);
      const user = userResult.rows[0];
      console.log("compairing passwds");
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        console.log("wrong passwd");
        return res.status(401).json({ error: "invalid credentials" });
      }
      res.json({
        message: "login successful",
        user: { id: user.id, name: user.name, email: user.email },
      });
    } else {
      console.log("new user...");

      if (!name) {
        console.log("needs a name");
        return res.status(400).json({ error: "username required" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await pool.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
        [name, email, hashedPassword],
      );

      res.status(201).json({
        message: "user created",
        user: {
          id: newUser.rows[0].id,
          name: newUser.rows[0].name,
          email: newUser.rows[0].email,
        },
      });
    }
  } catch (error) {
    console.error("critical error", error);
    res.status(500).json({ error: error.message });
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

app.get("/users/check", async (req, res) => {
  const { email } = req.query;
  try {
    const result = await pool.query(
      "SELECT EXISTS(SELECT 1 FROM users WHERE email = $1",
      [email],
    );
    res.json({ exists: result.rows[0].exists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server error" });
  }
});

export { pool };
export default app;
