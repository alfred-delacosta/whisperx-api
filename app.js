import express from 'express';


const app = express();
const port = 5050;

app.get('/', (req, res) => {
    res.send("This is it.")
})

app.listen(port, () => {
    console.log("Listening on the port");
})