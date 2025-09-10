// src/pages/SessionPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import Whiteboard from "../components/Whiteboard";
import ChatBox from "../components/ChatBox";

export default function SessionPage() {
  const { id: sessionId } = useParams();

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <Whiteboard sessionId={sessionId} />
      <ChatBox sessionId={sessionId} />
    </div>
  );
}
