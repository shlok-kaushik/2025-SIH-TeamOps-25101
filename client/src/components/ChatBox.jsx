import React, { useState, useEffect } from "react";
import { useSocket } from "../hooks/useSocket";

export default function ChatBox({ sessionId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const { sendChat } = useSocket(
    sessionId,
    null,
    (msg) => {
      setMessages((prev) => [...prev, msg]);
    }
  );

  const handleSend = () => {
    if (input.trim() === "") return;
    const newMsg = { message: input, self: true };
    setMessages((prev) => [...prev, newMsg]);
    sendChat(input);
    setInput("");
  };

  return (
    <div style={{ border: "1px solid gray", padding: "10px", width: "300px" }}>
      <div
        style={{
          height: "200px",
          overflowY: "auto",
          border: "1px solid lightgray",
          marginBottom: "8px",
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.self ? "right" : "left" }}>
            <span>{m.message}</span>
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        style={{ width: "80%" }}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
