import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";

import { AuthContext } from "../context/AuthContext";
import Whiteboard from "../components/Whiteboard";
import ChatBox from "../components/ChatBox";

const SOCKET_URL = "http://localhost:4000"; // backend url

export default function Classroom() {
  const { user } = useContext(AuthContext);
  const { id: classroomId } = useParams(); // classroom id from URL
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const s = io(SOCKET_URL, { autoConnect: true });

    s.on("connect", () => {
      console.log("✅ Connected as", user.email, "role:", user.role);
      // Join the classroom room
      s.emit("join-classroom", { classroomId, user });
    });

    // Lifecycle events
    s.on("classroom-ended", () => {
      alert("Classroom has ended. Returning to dashboard.");
      navigate("/"); // redirect to dashboard
    });

    // Optional: join/leave logs
    s.on("user-joined", (u) => console.log("👋", u.email, "joined"));
    s.on("user-left", (u) => console.log("❌", u.email, "left"));

    setSocket(s);

    return () => {
      if (s.connected) {
        s.emit("leave-classroom", { classroomId, user });
        s.disconnect();
      }
    };
  }, [classroomId, user, navigate]);

  if (!socket) return <div>Connecting to classroom...</div>;

  return (
    <div style={{ display: "flex", gap: "20px", height: "100vh" }}>
      {/* Left: Whiteboard */}
      <div style={{ flex: 3, borderRight: "1px solid #ddd" }}>
        <Whiteboard
          classroomId={classroomId}
          socket={socket}
          user={user}
          canDraw={user.role === "teacher"} // ✅ only teacher can draw
        />
      </div>

      {/* Right: Chat */}
      <div style={{ flex: 1 }}>
        <ChatBox
          classroomId={classroomId}
          socket={socket}
          user={user}
        />
      </div>
    </div>
  );
}
