import express from 'express';
import 'dotenv/config'


const app = express();
const port = process.env.PORT || 5052;

app.use(express.json());

//#region Routers
import ffmpegRouter from './routers/ffmpeg.router.js';
import whisperXRouter from './routers/whisperx.router.js';
import subtitlesRouter from './routers/subtitles.router.js';
//#endregion

app.get('/', (req, res) => {
    res.send("This is it.")
})

app.use('/ffmpeg', ffmpegRouter);
app.use('/whisperx', whisperXRouter)
app.use('/subtitles', subtitlesRouter);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})