import express from "express";
import http from "http";
import { Socket, Server as SocketServer } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

io.on("connect", (socket) => {
  console.log("a client!");

  socket.on("message", (data) => {
    socket.broadcast.emit("message", data);
    console.log(data);
  });
});

server.listen(3000);
console.log("server on http://localhost:3000/");
