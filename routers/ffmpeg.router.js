import { upload } from "../utils/multer.util.js";
import express from "express";
import {
  cleanUpConvertedFile,
  convertVideoToMp3,
  convertVideoToMp4,
} from "../service/ffmpeg.service.js";
import { splitFilename } from "../utils/fileExtensions.utils.js";

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
    const convertedPath = `converted/${file.originalname}`;

    const ffmpegProcess = convertVideoToMp4(file, res);

    ffmpegProcess.on("exit", () => {
      res.download(convertedPath, req.file.originalname, async (err) => {
        if (err) {
          console.error("Download error:", err);
        } else {
          console.log("📤 File sent successfully");
        }
        await cleanUpConvertedFile(file, convertedPath);
      });
    });
  } catch (error) {
    res.status(400).json({
      message: "There was an error converting the video.",
      error: error.message,
    });
  }
});

router.post("/convertVideoToMp3", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No video file provided" });
    }

    const file = req.file;
    const fileNameSplit = splitFilename(file.originalname);
    const convertedPath = `converted/${fileNameSplit.name}.mp3`;

    const ffmpegProcess = convertVideoToMp3(file, res);

    ffmpegProcess.on("exit", () => {
      res.download(convertedPath, `${fileNameSplit.name}.mp3`, async (err) => {
        if (err) {
          console.error("Download error:", err);
        } else {
          console.log("📤 File sent successfully");
        }
        await cleanUpConvertedFile(file, convertedPath);
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
