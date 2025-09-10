import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import fileRoutes from "./routes/files.js";
import sessionRoutes from "./routes/sessions.js";

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use("/auth", authRoutes);
app.use("/files", fileRoutes);
app.use("/sessions", sessionRoutes);

export default app;
