import express from 'express';
import 'dotenv/config'


const app = express();
const port = 5050;

app.use(express.json());

//#region Routers
import ffmpegRouter from './routers/ffmpeg.router.js';
//#endregion

app.get('/', (req, res) => {
    res.send("This is it.")
})

app.use('/ffmpeg', ffmpegRouter);

app.listen(port, () => {
    console.log("Listening on the port");
})