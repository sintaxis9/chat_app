import http from "http";
import { Server as SocketServer } from "socket.io";
import app from "./src/app.js";
import { setupSocket } from "./src/socket.js";

const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: { origin: "*" },
});

setupSocket(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`server in http://localhost:${PORT}`);
});
