const socketIo = require("socket.io");

function initializeSocket(server) {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  const activeUsers = new Map();

  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("userJoined", (userData) => {
      activeUsers.set(socket.id, userData);
      io.emit("activeUsers", Array.from(activeUsers.values()));
    });

    socket.on("codeChange", (code) => {
      socket.broadcast.emit("codeChange", code);
    });

    socket.on("disconnect", () => {
      activeUsers.delete(socket.id);
      io.emit("activeUsers", Array.from(activeUsers.values()));
      console.log("Client disconnected");
    });
  });

  return io;
}

module.exports = initializeSocket;
