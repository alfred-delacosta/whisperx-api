import { upload } from "../utils/multer.util.js";
import express from "express";
import { convertVideoToMp4 } from "../service/ffmpeg.service.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("You nailed it");
});

router.post("/convertVideo", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No video file provided" });
    }

    const file = req.file;
    const ffmpegProcess = await convertVideoToMp4(file, res);

    ffmpegProcess.on("exit", () => {
      res.status(200).json({
        message: "Video converted successfully.",
        file
      });

    });
  } catch (error) {
    res.status(400).json({
      message: "There was an error converting the video.",
      error: error.message,
    });
  }
});

export default router;
