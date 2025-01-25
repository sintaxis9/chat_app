export const setupSocket = (io) => {
  io.on("connect", (socket) => {
    console.log("a client!");

    socket.on("message", (data) => {
      if (!data || typeof data.body !== "string" || data.from) {
        console.error("invalid message data:", data);
        return;
      }
      console.log(`${data.from}: ${data.body}`);
      socket.broadcast.emit("message", data);
    });

    socket.on("disconnect", () => {
      console.log("a client die");
    });
  });
};
