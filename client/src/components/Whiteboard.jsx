import { Stage, Layer, Line } from "react-konva";
import { useState, useRef } from "react";

export default function Whiteboard({ socket }) {
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);

  const handleMouseDown = (e) => { isDrawing.current = true; setLines([...lines, []]); };
  const handleMouseUp = () => { isDrawing.current = false; };
  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let newLines = lines.slice();
    newLines[newLines.length - 1] = newLines[newLines.length - 1].concat([point.x, point.y]);
    setLines(newLines);
    socket.current.emit("annotation:event", { sessionId: "demo", points: newLines[newLines.length - 1] });
  };

  return (
    <Stage width={800} height={600}
      onMouseDown={handleMouseDown}
      onMouseup={handleMouseUp}
      onMousemove={handleMouseMove}
    >
      <Layer>
        {lines.map((line, i) => (
          <Line key={i} points={line} stroke="black" strokeWidth={2} />
        ))}
      </Layer>
    </Stage>
  );
}
