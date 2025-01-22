import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "*",
  },
});

io.on("connect", (socket) => {
  console.log("A Client!");

  socket.on("message", (data) => {
    if (!data.body || data.body.trim() === "") return;
    console.log(`${data.from}: ${data.body}`);
    socket.broadcast.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("a client die!");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
