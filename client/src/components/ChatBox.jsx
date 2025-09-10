import { useState, useEffect } from "react";

export default function ChatBox({ socket }) {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.current.on("chat:remote", (data) => setMessages((m) => [...m, data]));
  }, [socket]);

  const sendMessage = () => {
    const message = { sessionId: "demo", text: msg, user: "student1" };
    socket.current.emit("chat:message", message);
    setMessages([...messages, message]);
    setMsg("");
  };

  return (
    <div>
      <div style={{ height: "200px", overflowY: "scroll" }}>
        {messages.map((m, i) => <p key={i}><b>{m.user}:</b> {m.text}</p>)}
      </div>
      <input value={msg} onChange={(e) => setMsg(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
