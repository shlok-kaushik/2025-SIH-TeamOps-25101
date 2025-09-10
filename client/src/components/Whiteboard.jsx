import React, { useEffect, useRef, useState } from "react";

// Simple SVG icons for the toolbar
const BrushIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

const EraserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19.38 2.62a2.62 2.62 0 0 1 3.71 3.71L9.43 22.01a1 1 0 0 1-.84.39H4.21a2.21 2.21 0 0 1-2.21-2.21v-4.38a1 1 0 0 1 .39-.84L19.38 2.62zM22 7.76l-5.71-5.71" />
  </svg>
);

export default function Whiteboard({ sessionId, socket, user }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(5);
  const [mode, setMode] = useState("brush"); // 'brush' or 'eraser'

  // Function to draw a line on the canvas
  const drawLine = (ctx, x1, y1, x2, y2, strokeColor, strokeSize, compositeOperation) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalCompositeOperation = compositeOperation;
    ctx.stroke();
    ctx.closePath();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const handleDraw = (data) => {
      const { prevX, prevY, x, y, color: drawColor, size: drawSize, mode: drawMode } = data;
      const compositeOperation = drawMode === "eraser" ? "destination-out" : "source-over";
      const strokeColor = drawMode === "eraser" ? "rgba(0,0,0,1)" : drawColor;
      drawLine(ctx, prevX, prevY, x, y, strokeColor, drawSize, compositeOperation);
    };
    
    const handleClear = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    socket.on("draw", handleDraw);
    socket.on("clear", handleClear);

    return () => {
      socket.off("draw", handleDraw);
      socket.off("clear", handleClear);
    };
  }, [socket]);

  // Gets mouse position relative to the canvas
  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    return { 
      x: (e.clientX - rect.left) * scaleX, 
      y: (e.clientY - rect.top) * scaleY 
    };
  };

  const handleMouseDown = (e) => {
    if (user?.role?.toLowerCase() !== "teacher") return;
    setLastPos(getMousePos(e));
    setDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!drawing || user?.role?.toLowerCase() !== "teacher") return;

    const currentPos = getMousePos(e);
    const ctx = canvasRef.current.getContext("2d");
    
    const compositeOperation = mode === "eraser" ? "destination-out" : "source-over";
    const strokeColor = mode === "eraser" ? "rgba(0,0,0,1)" : color;

    // Draw locally first for responsiveness
    drawLine(ctx, lastPos.x, lastPos.y, currentPos.x, currentPos.y, strokeColor, size, compositeOperation);
    
    const drawData = {
      sessionId,
      prevX: lastPos.x,
      prevY: lastPos.y,
      x: currentPos.x,
      y: currentPos.y,
      color,
      size,
      mode,
    };
    
    // Broadcast to other users
    socket.emit("draw", drawData);
    setLastPos(currentPos);
  };

  const handleMouseUp = () => setDrawing(false);
  const handleMouseLeave = () => setDrawing(false);

  const handleClear = () => {
    if (user?.role?.toLowerCase() !== "teacher") return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit("clear", { sessionId });
  };

  // Common class for toolbar buttons
  const toolButtonClasses = "p-2 rounded-md transition-colors duration-200 ease-in-out flex items-center justify-center";
  const activeToolClasses = "bg-blue-500 text-white";
  const inactiveToolClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300";

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 w-full max-w-5xl mx-auto">
      {user?.role?.toLowerCase() === "teacher" && (
        <div className="mb-4 p-2 bg-gray-100 rounded-lg flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setMode("brush")}
            className={`${toolButtonClasses} ${mode === 'brush' ? activeToolClasses : inactiveToolClasses}`}
            title="Brush"
          >
            <BrushIcon />
          </button>
          <button
            onClick={() => setMode("eraser")}
            className={`${toolButtonClasses} ${mode === 'eraser' ? activeToolClasses : inactiveToolClasses}`}
            title="Eraser"
          >
            <EraserIcon />
          </button>
          
          <div className="h-8 w-px bg-gray-300 mx-2"></div>

          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-10 p-1 bg-white border border-gray-300 rounded-md cursor-pointer"
            title="Color Picker"
          />
          
          <div className="flex items-center gap-2 text-gray-700">
            <label htmlFor="brush-size" className="text-sm font-medium">Size</label>
            <input
              id="brush-size"
              type="range"
              min="1"
              max="50"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-24 cursor-pointer"
              title="Brush Size"
            />
          </div>
          
          <div className="h-8 w-px bg-gray-300 mx-2"></div>

          <button 
            onClick={handleClear} 
            className="px-4 py-2 rounded-md bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors duration-200 ease-in-out"
          >
            Clear All
          </button>
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={1000} // Higher resolution for drawing logic
        height={750}
        className={`w-full h-auto bg-white rounded-lg border border-gray-300 shadow-inner ${user?.role?.toLowerCase() === "teacher" ? 'cursor-crosshair' : 'cursor-not-allowed'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave} // Stop drawing if mouse leaves canvas
      />

      {user?.role?.toLowerCase() === "student" && (
        <div className="mt-4 text-center text-gray-500 bg-gray-100 p-3 rounded-lg">
          <p className="font-medium">You are in view-only mode.</p>
          <p className="text-sm">You can observe the whiteboard and use the chat.</p>
        </div>
      )}
    </div>
  );
}
