import { upload } from "../utils/multer.util.js";
import express from "express";
import { __dirname } from "../utils/path.utils.js";
import path from "path";
import { getOriginalFilenameWithoutExtension, getUploadFilenameWithoutExtension, splitAudioFilename, splitFilename } from "../utils/fileExtensions.utils.js";
import { cleanUpSubtitleFolder, transcribeWithWhisperX } from "../service/whisperx.service.js";
import { cleanUpUploadsFolder } from "../utils/uploads.utils.js";

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
    // 21598-KanekoaTheGreat-1813625661891948545-20240717
    const uploadFileNameWithoutExtension = getUploadFilenameWithoutExtension(file);
    const originalNameWithoutExtension = getOriginalFilenameWithoutExtension(file);
    const subtitleFolder = path.join("subtitles", originalNameWithoutExtension);
    const subtitleFileName = `${uploadFileNameWithoutExtension}.vtt`;
    const subtitleOriginalName = `${originalNameWithoutExtension}.vtt`;
    //"a54ba260-f541-4f1c-b369-f83037604e78.vtt"

    const whisperProcess = transcribeWithWhisperX(file, res, subtitleFolder);
    const fullSubtitleFilePath = path.join(subtitleFolder, subtitleFileName);

    whisperProcess.on("exit", () => {
      res.download(fullSubtitleFilePath, subtitleOriginalName, async (err) => {
        if (err) {
          console.error("Download error:", err);
        } else {
          console.log("📤 File sent successfully");
        }
        // await cleanUpSubtitleFolder(subtitleFolder);
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
