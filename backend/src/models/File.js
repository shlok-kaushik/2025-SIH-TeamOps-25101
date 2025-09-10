import express from "express";
import multer from "multer";
import { uploadToS3, getPresignedUrl } from "../utils/s3.js";
import { authMiddleware } from "../middleware/auth.js";
import db from "../config/db.js";

const upload = multer({ dest: "uploads/", limits: { fileSize: 50 * 1024 * 1024 } });
const router = express.Router();

// Upload file (Teacher/Admin only)
router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  if (req.user.role === "student") {
    return res.status(403).json({ error: "Only teachers/admins can upload" });
  }

  try {
    const result = await uploadToS3(req.file);
    const file = await db.file.create({
      data: {
        name: req.file.originalname,
        url: result.Key,
        uploadedBy: req.user.id
      }
    });
    res.json({ success: true, file });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// Get list of files (all roles can read)
router.get("/", authMiddleware, async (req, res) => {
  const files = await db.file.findMany({ include: { uploader: true } });
  const withUrls = await Promise.all(files.map(async f => ({
    ...f,
    downloadUrl: await getPresignedUrl(f.url)
  })));
  res.json(withUrls);
});

export default router;
