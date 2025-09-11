import React, { useContext, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";

import { AuthContext } from "../context/AuthContext";
import Whiteboard from "../components/Whiteboard";
import ChatBox from "../components/ChatBox";
import AudioStream from "../components/AudioStream";

const SOCKET_URL = "http://localhost:4000"; // backend url

export default function Classroom() {
  const { user } = useContext(AuthContext);
  const { id: classroomId } = useParams();
  const navigate = useNavigate();

  const [connected, setConnected] = useState(false);

  // ✅ Create socket once (per classroom+user)
  const socket = useMemo(() => {
    if (!user) return null;
    return io(SOCKET_URL, { autoConnect: false });
  }, [user, classroomId]);

  useEffect(() => {
    if (!socket || !user) return;

    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Connected as", user.email, "role:", user.role);
      socket.emit("join-classroom", { classroomId, user });
      setConnected(true);
    });

    socket.on("classroom-ended", () => {
      alert("Classroom has ended. Returning to dashboard.");
      navigate("/");
    });

    socket.on("user-joined", (u) =>
      console.log("👋", u?.email, "joined", classroomId)
    );
    socket.on("user-left", (u) =>
      console.log("❌", u?.email, "left", classroomId)
    );

    return () => {
      if (socket.connected) {
        socket.emit("leave-classroom", { classroomId, user });
        socket.disconnect();
      }
      setConnected(false);
    };
  }, [socket, classroomId, user, navigate]);

  if (!connected || !socket) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-400">Connecting to classroom...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 gap-4 p-4">
      {/* Left: Whiteboard */}
      <div className="flex-grow md:flex-3 overflow-hidden">
        <Whiteboard classroomId={classroomId} socket={socket} user={user} />
      </div>

      {/* Right: Chat */}
      <div className="w-full md:w-96 md:flex-1 h-full md:max-h-[calc(100vh-2rem)] overflow-hidden">
        <ChatBox classroomId={classroomId} socket={socket} user={user} />
      </div>

      {/* Floating Audio */}
      <AudioStream socket={socket} user={user} classroomId={classroomId} />
    </div>
  );
}
