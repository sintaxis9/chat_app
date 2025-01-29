import { pool } from "./app.js";

export const setupSocket = (io) => {
  io.on("connect", (socket) => {
    console.log("a client!");

    socket.on("message", async (data) => {
      if (!data || typeof data.body !== "string" || !data.user_id) {
        console.error("invalid message data:", data);
        return;
      }

      try {
        const result = await pool.query(
          "INSERT INTO messages (user_id, data) VALUES ($1, $2) RETURNING *",
          [data.user_id, data.body],
        );
        const fullMessage = {
          ...data,
          id: result.rows[0].id,
          send_in: result.rows[0].send_in,
        };
        io.emit("message", fullMessage);
      } catch (err) {
        console.error("error saving message:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("a client disconnected");
    });
  });
};
