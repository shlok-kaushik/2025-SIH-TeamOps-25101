export default function classroomSocket(io, socket) {
  // Join a classroom
  socket.on("join-classroom", ({ classroomId, user }) => {
    socket.join(`classroom-${classroomId}`);
    socket.data.user = user;
    socket.data.classroomId = classroomId;

    console.log(`${user.email} joined classroom ${classroomId}`);

    io.to(`classroom-${classroomId}`).emit("user-joined", {
      user,
      classroomId,
    });
  });

  // Whiteboard drawing (teacher only)
  socket.on("draw", (data) => {
    const user = socket.data.user;
    const classroomId = socket.data.classroomId;
    if (!user || user.role.toLowerCase() !== "teacher") return;

    io.to(`classroom-${classroomId}`).emit("draw", data);
  });

  // Chat messages (everyone can chat)
  // Chat messages (everyone can chat)
socket.on("chat", (msg) => {
  const classroomId = socket.data.classroomId;
  if (!classroomId) return;

  const message = {
    user: socket.data.user,
    text: msg.text,            // ✅ extract text properly
    timestamp: msg.timestamp,  // ✅ forward timestamp
  };

  io.to(`classroom-${classroomId}`).emit("chat", message);
});


  // Clear canvas (teacher only)
  socket.on("clear", () => {
    const user = socket.data.user;
    const classroomId = socket.data.classroomId;
    if (!user || user.role.toLowerCase() !== "teacher") return;

    io.to(`classroom-${classroomId}`).emit("clear");
  });

  // Leave classroom
  socket.on("leave-classroom", () => {
    const classroomId = socket.data.classroomId;
    if (classroomId) {
      socket.leave(`classroom-${classroomId}`);
      io.to(`classroom-${classroomId}`).emit("user-left", socket.data.user);
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    const classroomId = socket.data.classroomId;
    if (classroomId) {
      io.to(`classroom-${classroomId}`).emit("user-left", socket.data.user);
    }
    console.log("Client disconnected:", socket.id);
  });
}
