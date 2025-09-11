import http from "http";
import express from "express";
import { Server } from "socket.io";
import app from "./app.js";
import classroomSocket from "./sockets/classroom.js";
import cors from "cors";

app.use(cors({
  origin: ["http://localhost:5173", "https://your-frontend.onrender.com", "https://your-frontend.vercel.app"],
  credentials: true,
}));

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

// attach classroom socket
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  classroomSocket(io, socket);
});

server.listen(PORT,'0.0.0.0', () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
