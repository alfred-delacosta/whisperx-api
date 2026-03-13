import { __dirname } from "../utils/path.utils.js";
import { spawn } from "child_process";
import path from "path";
import fs from "fs/promises";
import { splitFilename } from "../utils/fileExtensions.utils.js";
import 'dotenv/config'

/**
 * WhisperX-specific stdout/stderr handlers
 */
function handleWhisperStdout(data) {
  const output = data.toString();
  console.log("WhisperX:", output.trim()); // WhisperX logs detailed info here

  // Detect processing steps
  if (output.includes("Processing")) {
    console.log("\n🔄 WhisperX: Started processing...");
  }
}

function handleWhisperStderr(data) {
  const stderrLine = data.toString();

  // Extract progress percentage from WhisperX output
  const progressMatch = stderrLine.match(/(\d+(?:\.\d+)?)%/);
  if (progressMatch && whisperProgressBar) {
    whisperProgressBar.update(progressMatch[1]);
  }

  // Step detection
  if (stderrLine.includes("Loading VAD")) {
    console.log("\n🎤 Loading Voice Activity Detection...");
  } else if (stderrLine.includes("Aligning")) {
    console.log("\n⏰ Aligning timestamps...");
  } else if (stderrLine.includes("Transcribing")) {
    console.log("\n📝 Transcribing audio...");
  } else if (stderrLine.includes("100%")) {
    console.log("\n✅ WhisperX transcription complete!");
  }
}

export const transcribeWithWhisperX = (file, res, subtitlePath) => {
  const whisperArgs = [
    "--compute_type",
    "float32",
    // "--language",
    // "en",
    "--model",
    process.env.WHISPER_X_MODEL || "base",
    "--highlight_words",
    "True",
    "--device",
    "cuda",
    "--verbose",
    "True",
    "--log-level",
    "debug",
    file.path,
    "--output_dir",
    subtitlePath,
  ];

  console.log("🗣️  Starting WhisperX transcription...");
  console.log("📁 Input:", file.path);
  console.log("📤 Output:", path.join(__dirname, "..", "subtitles"));

  const whisperProcess = spawn("whisperx", whisperArgs);

  whisperProcess.stdout.on("data", handleWhisperStdout);
  whisperProcess.stderr.on("data", handleWhisperStderr);

  whisperProcess.on("close", (code) => {
    if (code === 0) {
      console.log("✅ WhisperX transcription ready - sending JSON to client");
    } else {
      console.error("❌ WhisperX failed with code:", code);
    }
  });

  whisperProcess.on("error", (error) => {
    console.error("❌ WhisperX Spawn Error:", error.message);
    res.status(400).send({ message: "WhisperX failed to spawn" });
  });

  return whisperProcess;
};

export const cleanUpSubtitleFolder = async (subtitleFolder) => {
  // Cleanup files
  await fs.rm(subtitleFolder, { recursive: true });
};