// backend/src/controllers/messageController.js
import { pool } from "../app.js";

export const sendMessage = async (req, res) => {
  const { user_id, data } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO messages (user_id, data) VALUES ($1, $2) RETURNING *",
      [user_id, data],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT m.id, m.data, m.send_in, u.name AS from FROM messages m JOIN users u ON m.user_id = u.id ORDER BY m.id ASC",
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
