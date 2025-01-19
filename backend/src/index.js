const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());

const messages = [];

app.get("/", (req, res) => {
  res.send("Servidor corriendo");
});

io.on("connection", (socket) => {
  console.log("Nuevo usuario conectado");

  socket.emit("receive_message", messages);

  socket.on("send_message", (message) => {
    messages.push(message);
    io.emit("receive_message", messages);
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});

server.listen(3000, () => {
  console.log("Servidor escuchando en puerto 3000");
});
