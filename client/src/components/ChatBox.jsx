import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChatBox({ classroomId, socket, user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    if (socket) {
      socket.on("chat", (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    }
    return () => {
      if (socket) {
        socket.off("chat");
      }
    };
  }, [socket]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !user) return;

    const msg = {
      classroomId,
      user: { email: user.email || "anonymous", role: user.role || "student" },
      text: input,
      timestamp: new Date().toISOString(),
    };

    socket.emit("chat", msg);
    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <ScrollArea className="flex-grow mb-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((m, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold">{m.user?.email}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(m.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p>{m.text}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </CardContent>
    </Card>
  );
}