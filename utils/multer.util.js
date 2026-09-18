import multer from "multer";
import path from "path";
import { generateShortId } from "./id.utils.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, generateShortId() + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage: storage,
    fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/") || file.mimetype.startsWith("audio/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video and audio files are allowed!"), false);
    }
  },
});
