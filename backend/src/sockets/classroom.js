export default function classroomSocket(io, socket) {
  // Whiteboard drawing
  socket.on("draw", (data) => {
    socket.broadcast.emit("draw", data);
  });

  // Chat message
  socket.on("chat", (msg) => {
    socket.broadcast.emit("chat", msg);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
}
