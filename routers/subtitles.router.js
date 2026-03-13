import { upload } from "../utils/multer.util.js";
import express from "express";
import fs from 'fs/promises';
import path from "path";
import {
  cleanUpConvertedFile,
  convertVideoToMp3,
  convertVideoToMp4,
} from "../service/ffmpeg.service.js";
import { generalSplitFileName, getNameWithOutExtension, splitFilename } from "../utils/fileExtensions.utils.js";
import { __dirname } from "../utils/path.utils.js";

const router = express.Router();

router.get("/text/:videoName", async (req, res) => {
  try {
    const videoName = req.params.videoName;
    const nameWithoutExtension = getNameWithOutExtension(videoName);
    const directory = await fs.readdir(path.join('subtitles', nameWithoutExtension));

    for (const file of directory) {
        const fileNameSplit = generalSplitFileName(file);

        if (fileNameSplit.ext == 'txt') {
            const fileContents = await fs.readFile(path.join('subtitles', nameWithoutExtension, file), 'utf8');
            res.json({ subtitles: fileContents });
            break;
        }
    }
    
  } catch (error) {
    res.status(400).json({
      message: "There was an error getting the subtitles file.",
      error: error.message,
    });
  }
});

export default router;
