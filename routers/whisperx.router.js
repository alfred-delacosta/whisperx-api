import { upload } from "../utils/multer.util.js";
import express from "express";
import path from "path";
import fs from "fs/promises";
import { getOriginalFilenameWithoutExtension } from "../utils/fileExtensions.utils.js";
import { generateShortId } from "../utils/id.utils.js";
import { transcribeWithWhisperX } from "../service/whisperx.service.js";
import { cleanUpUploadsFolder } from "../utils/uploads.utils.js";
import { insertTranscription } from "../utils/database.js";

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
    const originalNameWithoutExtension = getOriginalFilenameWithoutExtension(file);
    const originalFull = file.originalname;
    const generatedId = generateShortId();
    const ext = path.extname(file.filename);
    const newFilename = `${generatedId}${ext}`;
    const oldPath = file.path;
    const newPath = path.join("uploads", newFilename);
    await fs.rename(oldPath, newPath);
    file.filename = newFilename;
    file.path = newPath;
    const subtitleFolder = path.join("subtitles", generatedId);
    const subtitleFileName = `${generatedId}.vtt`;
    const subtitleOriginalName = `${originalNameWithoutExtension}.vtt`;
    insertTranscription(originalFull, generatedId);
    await fs.mkdir(subtitleFolder, { recursive: true });
    const whisperProcess = transcribeWithWhisperX(file, res, subtitleFolder);
    const fullSubtitleFilePath = path.join(subtitleFolder, subtitleFileName);

    whisperProcess.on("exit", () => {
      res.download(fullSubtitleFilePath, subtitleOriginalName, async (err) => {
        if (err) {
          console.error("Download error:", err);
        } else {
          console.log("📤 File sent successfully");
        }
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
