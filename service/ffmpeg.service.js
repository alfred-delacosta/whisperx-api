import { __dirname } from "../utils/path.utils.js";
import { spawn } from "child_process";
import { join } from "path";
import fs from 'fs/promises';

const env = process.env;

const convertVideoUsingNvidiaCuda = (file) => {
  return [
    "-y", // Overwrite the file if it exists
    "-hwaccel",
    "cuda",
    "-hwaccel_output_format",
    "cuda",
    "-i",
    file.path,
    "-c:v",
    "h264_nvenc",
    "-preset",
    env.FFMPEG_CUDA_PRESET,
    join("converted", file.originalname),
  ];
  // 'ffmpeg -hwaccel cuda -hwaccel_output_format cuda -i input.mp4 -c:v h264_nvenc -preset fast output.mp4'

  // No audio rencoding
  // 'ffmpeg -hwaccel cuda -hwaccel_output_format cuda -i input.mp4 -c:v h264_nvenc -c:a copy -preset fast output.mp4'
};

function handleStdout(data) {
  const output = data.toString();
  if (output.includes("frame=")) {
    // Progress info (frame=XXX fps=YYY)
    const frameMatch = output.match(/frame=\s*(\d+)/);
    if (frameMatch) {
      console.log(`📹 Progress: Frame ${frameMatch[1]} processed`);
    }
  }
  // Log other stdout info (stream info, etc.)
  console.log("STDOUT:", output.trim());
}

function handleStderr(data) {
  const error = data.toString();

  // Progress percentage (if available)
  const percentMatch = error.match(/time=(\d{2}):(\d{2}):(\d{2}\.\d{2})/);
  if (percentMatch) {
    console.log(`⏳ FFmpeg Progress: ${percentMatch[0]}`);
  }

  // Warnings
  if (error.includes("[warning]")) {
    console.warn("⚠️  FFmpeg Warning:", error.trim());
  }

  // Non-critical info
  if (!error.includes("error") && !error.includes("failed")) {
    return;
  }

  console.error("STDERR:", error.trim());
}

function handleSpawnError(error) {
  console.error("❌ Spawn Error:", error.message);
}

function handleExit(code, signal) {
  if (code === 0) {
    console.log("✅ FFmpeg conversion completed successfully!");
  } else {
    console.error(`❌ FFmpeg failed with code ${code}, signal ${signal}`);
    process.exit(1);
  }
}

export const convertVideoToMp4 = (file, res) => {
  const args = convertVideoUsingNvidiaCuda(file);

  const ffmpegProcess = spawn("ffmpeg", args);

  // Attach callback handlers
  ffmpegProcess.stdout.on("data", handleStdout);
  ffmpegProcess.stderr.on("data", handleStderr);
  ffmpegProcess.on("error", handleSpawnError);
  ffmpegProcess.on("close", handleExit);

  return ffmpegProcess;
};

export const cleanUpConvertedFile = async (file, convertedPath) => {
  // Cleanup files
  await fs.rm(`uploads/${file.filename}`);
  await fs.rm(convertedPath);
};
