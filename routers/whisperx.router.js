import { upload } from "../utils/multer.util.js";
import express from "express";
import { __dirname } from "../utils/path.utils.js";
import path from "path";
import { splitFilename } from "../utils/fileExtensions.utils.js";
import { transcribeWithWhisperX } from "../service/whisperx.service.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("You nailed it");
});

router.post("/generateSubtitles", upload.single("mp3"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No mp3 file provided" });
    }

    const file = req.file;
    const fileNameSplit = splitFilename(file.filename);
    const originalNameSplit = splitFilename(file.originalname);
    console.log(originalNameSplit);
    const subtitlePath = path.join("subtitles", originalNameSplit.name);
    console.log(subtitlePath);

    const whisperProcess = transcribeWithWhisperX(file, res, subtitlePath);

    whisperProcess.on("exit", () => {
    //   res.send({ message: "Transcribing successfully.", file });
      res.download(subtitlePath, `${fileNameSplit.name}.vtt`, async (err) => {
        if (err) {
          console.error("Download error:", err);
        } else {
          console.log("📤 File sent successfully");
        }
        // await cleanUpConvertedFile(file, convertedPath);
      });
    });
  } catch (error) {
    res.status(400).json({
      message: "There was an error transcribing the video.",
      error: error.message,
    });
  }
});

export default router;
