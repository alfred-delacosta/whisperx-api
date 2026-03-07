import { upload } from "../utils/multer.util.js";
import express from "express";
import { __dirname } from "../utils/path.utils.js";
import path from "path";
import { splitAudioFilename, splitFilename } from "../utils/fileExtensions.utils.js";
import { cleanUpSubtitleFolder, transcribeWithWhisperX } from "../service/whisperx.service.js";
import { cleanUpUploadsFolder } from "../utils/uploads.utils.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("You nailed it");
});

router.post("/generateSubtitles", upload.single("mp3"), async (req, res) => {
    console.log("In the subtitles endpoint");
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No mp3 file provided" });
    }

    const file = req.file;
    const fileNameSplit = splitFilename(file.filename);
    const originalNameSplit = splitFilename(file.originalname);
    const subtitleFolder = path.join("subtitles", originalNameSplit.name);
    const subtitleName = `${fileNameSplit.name}.vtt`;

    const whisperProcess = transcribeWithWhisperX(file, res, subtitleFolder);
    const fullSubtitleFilePath = path.join(subtitleFolder, subtitleName);

    whisperProcess.on("exit", () => {
      res.download(fullSubtitleFilePath, subtitleName, async (err) => {
        if (err) {
          console.error("Download error:", err);
        } else {
          console.log("📤 File sent successfully");
        }
        await cleanUpSubtitleFolder(subtitleFolder);
        await cleanUpUploadsFolder();
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
