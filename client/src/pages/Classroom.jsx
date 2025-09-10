import Whiteboard from "../components/Whiteboard";
import ChatBox from "../components/ChatBox";

export default function Classroom() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: 3, borderRight: "1px solid #ccc" }}>
        <Whiteboard />
      </div>
      <div style={{ flex: 1 }}>
        <ChatBox />
      </div>
    </div>
  );
}
