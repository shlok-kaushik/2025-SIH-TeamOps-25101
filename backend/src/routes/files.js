import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// upload file
router.post("/upload", requireAuth, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ id: req.file.filename, name: req.file.originalname });
});

// list files (just reads /uploads dir for MVP)
router.get("/list", requireAuth, (req, res) => {
  const files = fs.readdirSync("uploads/").map((file, idx) => ({
    id: file,
    name: file,
  }));
  res.json(files);
});

// download file
router.get("/download/:id", requireAuth, (req, res) => {
  const filePath = path.join("uploads", req.params.id);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: "Not found" });
  res.download(filePath);
});

export default router;
