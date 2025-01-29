import { pool } from "./app.js";

export const setupSocket = (io) => {
  io.on("connect", (socket) => {
    console.log("a client!");

    socket.on("message", async (data) => {
      if (!data || typeof data.body !== "string" || !data.from) {
        console.error("invalid message data:", data);
        return;
      }
      console.log(`${data.from}: ${data.body}`);

      try {
        const result = await pool.query(
          "INSERT INTO messages (user_id, data) VALUES ($1, $2) RETURNING *",
          [data.from, data.body],
        );
        console.log("message saved:", result.rows[0]);
      } catch (err) {
        console.error("error saving message:", err);
      }

      socket.broadcast.emit("message", data);
    });

    socket.on("disconnect", () => {
      console.log("a client disconnected");
    });
  });
};
