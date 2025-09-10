export default function classroomSocket(io, socket) {
  // Join a session
  socket.on("join", ({ sessionId, user }) => {
    socket.join(sessionId);       // join room
    socket.data.user = user;      // store user info for role checks
    console.log(`${user.email} joined session ${sessionId}`);
  });

  // Whiteboard drawing (teacher only)
  socket.on("draw", (data) => {
    const user = socket.data.user;
    if (!user || user.role.toLowerCase() !== "teacher") return; // only teacher
    io.to(data.sessionId).emit("draw", data); // send to everyone in session
  });

  // Chat message (everyone)
  socket.on("chat", (msg) => {
    io.to(msg.sessionId).emit("chat", msg); // broadcast within session
  });

  // Clear canvas (teacher only)
  socket.on("clear", ({ sessionId }) => {
    const user = socket.data.user;
    if (!user || user.role.toLowerCase() !== "teacher") return; // only teacher
    io.to(sessionId).emit("clear");
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
}
