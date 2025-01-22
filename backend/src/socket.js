export const setupSocket = (io) => {
  io.on("connect", (socket) => {
    console.log("a client!");

    socket.on("message", (data) => {
      if (!data.body || data.body.trim() === "") return;
      console.log(`${data.from}: ${data.body}`);
      socket.broadcast.emit("message", data);
    });

    socket.on("disconnect", () => {
      console.log("a client die");
    });
  });
};
