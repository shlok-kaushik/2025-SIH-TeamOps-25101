import React, { useRef, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export default function Whiteboard({ sessionId }) {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);

  const { sendDraw } = useSocket(
    sessionId,
    (data) => {
      // render incoming strokes
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext("2d");
      context.beginPath();
      context.moveTo(data.prevX, data.prevY);
      context.lineTo(data.x, data.y);
      context.strokeStyle = "black";
      context.lineWidth = 2;
      context.stroke();
    },
    null
  );

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    setCtx(context);
    context.beginPath();
    context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e) => {
    if (!ctx) return;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
    sendDraw({
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
      prevX: e.nativeEvent.offsetX - 1,
      prevY: e.nativeEvent.offsetY - 1,
    });
  };

  const stopDrawing = () => {
    setCtx(null);
  };

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={400}
      style={{ border: "1px solid black" }}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
    />
  );
}
