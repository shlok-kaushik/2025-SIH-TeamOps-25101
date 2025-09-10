import express from "express";
import pool from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// create session
router.post("/create", requireAuth, async (req, res) => {
  try {
    const { title } = req.body;
    const result = await pool.query(
      "INSERT INTO sessions (title, teacher_id) VALUES ($1, $2) RETURNING *",
      [title, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// list sessions
router.get("/list", requireAuth, async (req, res) => {
  const result = await pool.query("SELECT * FROM sessions ORDER BY created_at DESC");
  res.json(result.rows);
});

export default router;
