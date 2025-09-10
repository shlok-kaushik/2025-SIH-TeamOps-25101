import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

import { AuthContext } from "../context/AuthContext";
import Whiteboard from "../components/Whiteboard";
import ChatBox from "../components/ChatBox";

const SOCKET_URL = "http://localhost:4000"; // update if needed

export default function Classroom() {
  const { user } = useContext(AuthContext);
  const { id: sessionId } = useParams();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io(SOCKET_URL, { autoConnect: true });
    setSocket(s);

    // Join the session with user info
    s.emit("join", { sessionId, user });

    return () => {
      s.disconnect();
    };
  }, [sessionId, user]);

  if (!socket) return <div>Connecting...</div>;

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <Whiteboard sessionId={sessionId} socket={socket} user={user} />
      <ChatBox sessionId={sessionId} socket={socket} user={user} />
    </div>
  );
}
