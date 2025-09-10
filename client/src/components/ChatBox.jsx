import React, { useEffect, useState, useRef } from "react";

export default function ChatBox({ classroomId, socket, user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    socket.on("chat", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chat");
    };
  }, [socket]);

  const sendMessage = () => {
    if (!input.trim() || !user) return;

    const msg = {
      classroomId, // ✅ fixed: matches Classroom.jsx
      user: { email: user.email || "anonymous", role: user.role || "student" },
      text: input,
      timestamp: new Date().toISOString(),
    };

    try {
      socket.emit("chat", msg);
      setMessages((prev) => [...prev, msg]); // optimistic render
      setInput("");
    } catch (err) {
      console.error("Chat send error:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // stop accidental reload
      sendMessage();
    }
  };

  return (
    <div
      style={{
        width: "100%",
        border: "1px solid #ccc",
        borderRadius: "5px",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          marginBottom: "10px",
        }}
      >
        {messages.map((m, idx) => (
          <div key={idx} style={{ marginBottom: "5px" }}>
            <strong>{m.user?.email ?? "unknown"}</strong>{" "}
            <span style={{ fontSize: "0.8em", color: "#555" }}>
              [{new Date(m.timestamp).toLocaleTimeString()}]
            </span>
            <div>{m.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          style={{ flex: 1, padding: "5px" }}
        />
        <button
          type="button"
          onClick={sendMessage}
          style={{ marginLeft: "5px" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
