import { useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";

// adjust to backend port
const SOCKET_URL = "http://localhost:4000";

export function useSocket(sessionId, onDraw, onChat) {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    // join specific classroom session
    socket.emit("join", { sessionId });

    // drawing events
    socket.on("draw", (data) => {
      if (onDraw) onDraw(data);
    });

    // chat messages
    socket.on("chat", (msg) => {
      if (onChat) onChat(msg);
    });

    return () => {
      socket.emit("leave", { sessionId });
      socket.disconnect();
    };
  }, [sessionId, onDraw, onChat]);

  // send draw data
  const sendDraw = useCallback((data) => {
    if (socketRef.current) {
      socketRef.current.emit("draw", { sessionId, ...data });
    }
  }, [sessionId]);

  // send chat message
  const sendChat = useCallback((message) => {
    if (socketRef.current) {
      socketRef.current.emit("chat", { sessionId, message });
    }
  }, [sessionId]);

  return { sendDraw, sendChat };
}
