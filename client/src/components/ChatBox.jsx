import React, { useEffect, useState, useRef } from "react";

export default function ChatBox({ sessionId, socket, user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new message arrives
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    // Listen for chat messages from server
    socket.on("chat", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chat");
    };
  }, [socket]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const msg = {
      sessionId,
      user: { email: user.email, role: user.role },
      text: input,
      timestamp: new Date().toISOString(),
    };

    socket.emit("chat", msg);
    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div
      style={{
        width: "300px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        height: "600px",
      }}
    >
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          marginBottom: "10px",
        }}
      >
        {messages.map((m, idx) => (
          <div key={idx} style={{ marginBottom: "5px" }}>
            <strong>{m.user.email}</strong>{" "}
            <span style={{ fontSize: "0.8em", color: "#555" }}>
              [{new Date(m.timestamp).toLocaleTimeString()}]
            </span>
            <div>{m.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          style={{ flex: 1, padding: "5px" }}
        />
        <button onClick={sendMessage} style={{ marginLeft: "5px" }}>
          Send
        </button>
      </div>
    </div>
  );
}
