import express from 'express';
import 'dotenv/config'

const THIRTY_MINUTES = 30 * 60 * 1000;

const app = express();
const port = process.env.PORT || 5052;

app.use(express.json());

app.use((req, res, next) => {
  req.setTimeout(THIRTY_MINUTES);
  res.setTimeout(THIRTY_MINUTES);
  next();
});

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

const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

server.requestTimeout = THIRTY_MINUTES;
server.headersTimeout = THIRTY_MINUTES + 1000;
server.keepAliveTimeout = THIRTY_MINUTES;