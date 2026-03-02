import { upload } from "../utils/multer.util.js";
import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("You nailed it");
});

router.post("/convertVideo", upload.single("video"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No video file provided" });
    }

    const filePath = req.file.path;

    res.status(200).json({
      file,
    });
  } catch (error) {
    res.status(400).json({
        message: "There was an error converting the video.",
        error: error.message
    })
  }
});

export default router;
