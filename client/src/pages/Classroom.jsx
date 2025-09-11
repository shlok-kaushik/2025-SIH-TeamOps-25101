import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";

import { AuthContext } from "../context/AuthContext";
import Whiteboard from "../components/Whiteboard";
import ChatBox from "../components/ChatBox";

const SOCKET_URL = "http://localhost:4000"; // backend url

export default function Classroom() {
  const { user } = useContext(AuthContext);
  const { id: classroomId } = useParams();
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const s = io(SOCKET_URL, { autoConnect: true });

    s.on("connect", () => {
      console.log("✅ Connected as", user.email, "role:", user.role);
      s.emit("join-classroom", { classroomId, user });
    });

    s.on("classroom-ended", () => {
      alert("Classroom has ended. Returning to dashboard.");
      navigate("/");
    });

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

  if (!socket) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-400">Connecting to classroom...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 gap-4 p-4">
      {/* Left: Whiteboard */}
      <div className="flex-grow md:flex-3">
        <Whiteboard
          classroomId={classroomId}
          socket={socket}
          user={user}
        />
      </div>

      {/* Right: Chat */}
      <div className="w-full md:w-96 md:flex-1 h-full md:max-h-[calc(100vh-2rem)]">
        <ChatBox
          classroomId={classroomId}
          socket={socket}
          user={user}
        />
      </div>
    </div>
  );
}
