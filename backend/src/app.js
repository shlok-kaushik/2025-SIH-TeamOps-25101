import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.js";
import notesRoutes from "./routes/notes.js";

const app = express();
app.use(cors());
app.use(express.json());

// existing auth endpoints
app.use("/auth", authRoutes);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// notes endpoints
app.use("/notes", notesRoutes);

export default app;
