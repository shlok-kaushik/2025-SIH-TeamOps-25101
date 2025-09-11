import express from "express";
import multer from "multer";
import path from "path";
import db from "../config/db.js"; // adjust path to your postgres client

const router = express.Router();

// configure multer for file uploads
const upload = multer({ dest: "uploads/notes/" });

// GET all notes
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM notes ORDER BY uploaded_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// POST upload a note (teacher only later via auth middleware)
router.post("/upload", upload.single("note"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const teacherId = req.user?.id || null; // from auth middleware if available
    const filepath = `/uploads/notes/${req.file.filename}`;

    const result = await db.query(
      "INSERT INTO notes (teacher_id, name, filepath) VALUES ($1, $2, $3) RETURNING *",
      [teacherId, req.file.originalname, filepath]
    );

    res.json({ success: true, note: result.rows[0] });
  } catch (err) {
    console.error("Error uploading note:", err);
    res.status(500).json({ error: "Failed to upload note" });
  }
});

export default router;
