<div align="center">

# 🚀 WhisperX + FFmpeg Media API

[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![GPU Accelerated](https://img.shields.io/badge/GPU-NVIDIA%20CUDA-brightgreen)](https://developer.nvidia.com/cuda)

**Complete media processing pipeline: Video/Audio conversion + AI transcription!** 🎬⚡➡️🎙️➡️📝

**GPU-accelerated FFmpeg** (MP4/MP3) + **WhisperX transcription** (VTT/TXT)

[📖 API Endpoints](#-api-endpoints) • [🚀 Installation](#-installation) • [🎯 Usage](#-usage) • [🏆 Milestones](#-milestones-planned) • [🤝 Contributing](#-contributing)

</div>

---

## ✨ Features

- 🎵 **Audio/Video Upload**: Auto-converts to optimal formats using FFmpeg.
- ⚡ **GPU-Accelerated FFmpeg**: NVIDIA CUDA (H.264_nvenc/MP3 encoding).
- 🧠 **WhisperX Transcription**: Word-level timestamps & speaker diarization.
- 📄 **JSON + SRT Output**: Structured data with subtitles.
- 🔄 **RESTful API**: Production-ready endpoints.
- 🚀 **Live Progress**: Real-time conversion monitoring.
- 🧹 **Auto-Cleanup**: Temporary files automatically removed.

## 📋 Requirements

- 🟢 Node.js (≥14.0.0)
- 🐍 Python (for WhisperX)
- 🔧 WhisperX ([GitHub](https://github.com/m-bain/whisperX))
- 🎬 **FFmpeg** (required - install on system & add to PATH)
- 💻 **NVIDIA GPU** (recommended for CUDA acceleration)
- 🎮 NVIDIA drivers + CUDA toolkit

## 🚀 Installation

1. **Clone the repo** 📥

   ```bash
   git clone <repository-url>
   cd whisper-x-api
   ```

2. **Install dependencies** 📦

   ```bash
   npm install
   ```

3. **Set up environment** 🔧
   - Copy `.env-sample` to `.env`
   - Set the `PORT` variable if needed (default: 3000)

4. **Install WhisperX** 🐍
   Follow the installation instructions at [WhisperX GitHub](https://github.com/m-bain/whisperX).
   **Important:** Ensure the `whisperx` command is available in your system's PATH environment variable.

## 🎯 Usage

### Development Mode 🛠️

```bash
npm run dev
```

### Production Mode 🚀

```bash
npm start
```

Server starts at `http://localhost:PORT` (e.g., 3000).

## 📖 API Endpoints

### 🎬 **FFmpeg Conversion** `/ffmpeg/*`

**POST /ffmpeg/convertVideo** → Video → **MP4** (GPU)

**POST /ffmpeg/convertVideoToMp3** → Video/Audio → **MP3**

```bash
curl -X POST -F "video=@input.mp4" http://localhost:5052/ffmpeg/convertVideo
curl -X POST -F "video=@input.mp4" http://localhost:5052/ffmpeg/convertVideoToMp3
```

**Auto-downloads converted file + cleanup**

### 🎙️ **WhisperX** `/whisperx/*`

**POST /whisperx/generateSubtitles** → MP3 → **VTT subtitles**

```bash
curl -X POST -F "mp3=@audio.mp3" http://localhost:5052/whisperx/generateSubtitles
```

**Auto-downloads VTT + cleanup**

### 📄 **Subtitles** `/subtitles/*`

**GET /subtitles/text/:videoName** → Get **TXT transcript**

```bash
curl http://localhost:5052/subtitles/text/myvideo
```

**💡 Pro Workflow:**
1. Video → `/ffmpeg/convertVideoToMp3`
2. MP3 → `/whisperx/generateSubtitles` 
3. Text → `/subtitles/text/videoname`

## 📁 Project Structure

- `uploads/` 📤: Temporary upload storage.
- `converted/` 🎥: GPU-processed MP4/MP3 outputs.
- `subtitles/` 📊: WhisperX transcription results.

## 🏆 Milestones (Planned)

✅ **More FFmpeg endpoints** - Multiple conversion types (MP4, MP3)  
✅ **SQLite database** - Track video/audio/subtitle metadata  
✅ **Extended subtitle downloads** - SRT, VTT, TXT, JSON formats  
✅ **SSE Messages** - Real-time progress for conversion & transcription  

**Join the journey!** 🌟

## 🤝 Contributing

We love contributions! 🌟

1. Fork the repo 🍴
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 📝

## 📜 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Alfred De La Costa** - [GitHub](https://github.com/alfred-delacosta) | [LinkedIn](https://www.linkedin.com/in/alfred-de-la-costa/)

---

<div align="center">

⭐ **Star this repo if you find it useful!**

</div>
