const connectedUsers = new Map();

function handleSocket(io, socket) {
  socket.on("userJoined", (user) => {
    connectedUsers.set(socket.id, {
      id: socket.id,
      name: user.name,
    });
    io.emit("users", Array.from(connectedUsers.values()));
  });

  socket.on("codeChange", (data) => {
    // Broadcast code changes to all other users
    socket.broadcast.emit("codeUpdate", data);
  });

  socket.on("disconnect", () => {
    connectedUsers.delete(socket.id);
    io.emit("users", Array.from(connectedUsers.values()));
  });
}

module.exports = handleSocket;
