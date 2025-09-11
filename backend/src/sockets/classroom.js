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
    text: msg.text,
    timestamp: msg.timestamp,
  };

  // ✅ broadcast only to others
  socket.to(`classroom-${classroomId}`).emit("chat", message);
});


  // WebRTC ICE candidate exchange (relay)
  socket.on("ice-candidate", ({ classroomId, candidate, role }) => {
    if (!classroomId || !candidate) return;
    // forward candidate to other peers in same classroom
    socket.to(`classroom-${classroomId}`).emit("ice-candidate", { candidate, role });
  });

  // Clear canvas (teacher only)
  socket.on("clear", () => {
    const user = socket.data.user;
    const classroomId = socket.data.classroomId;
    if (!user || user.role.toLowerCase() !== "teacher") return;

    io.to(`classroom-${classroomId}`).emit("clear");
  });

  // WebRTC: Teacher sends offer
  socket.on("teacher-offer", ({ classroomId, offer }) => {
    const user = socket.data.user;
    if (!user || user.role.toLowerCase() !== "teacher") return;
    if (!classroomId || !offer) return;

    // send to everyone else in the classroom (students)
    socket.to(`classroom-${classroomId}`).emit("teacher-offer", offer);
  });

  // WebRTC: Student sends answer
  socket.on("student-answer", ({ classroomId, answer }) => {
    const user = socket.data.user;
    if (!user || user.role.toLowerCase() !== "student") return;
    if (!classroomId || !answer) return;

    socket.to(`classroom-${classroomId}`).emit("student-answer", answer);
  });

  // WebRTC: Teacher mute/unmute
  socket.on("mute-status", ({ classroomId, muted }) => {
    const user = socket.data.user;
    if (!user || user.role.toLowerCase() !== "teacher") return;
    if (!classroomId) return;

    socket.to(`classroom-${classroomId}`).emit("mute-status", muted);
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
