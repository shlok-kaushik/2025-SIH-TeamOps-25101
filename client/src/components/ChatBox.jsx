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

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const msg = {
      classroomId,
      user: { email: user.email || "anonymous", role: user.role || "student" },
      text: input,
      timestamp: new Date().toISOString(),
    };

    try {
      socket.emit("chat", msg);
      // Optimistic update for sender
      setMessages((prev) => [...prev, msg]); 
      setInput("");
    } catch (err)
 {
      console.error("Chat send error:", err);
    }
  };

  return (
    <div
      className="bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col h-full"
    >
      <h3 className="text-xl font-bold mb-4 text-white border-b border-gray-700 pb-2">Live Chat</h3>
      {/* Messages */}
      <div
        className="flex-grow overflow-y-auto mb-4 pr-2"
      >
        {messages.map((m, idx) => (
          <div key={idx} className="mb-4">
            <div className="flex items-baseline gap-2">
                <strong className="text-blue-400 text-sm">{m.user?.email ?? "unknown"}</strong>
                <span className="text-xs text-gray-500">
                {new Date(m.timestamp).toLocaleTimeString()}
                </span>
            </div>
            <p className="text-gray-300">{m.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50"
          disabled={!input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}
