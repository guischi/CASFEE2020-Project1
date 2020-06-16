import express from 'express';
import path from 'path';

import {rtIndex} from './routes/index';
import {rtNotes} from './routes/notes';

const app = express();
const router = express.Router();

app.use(express.static(path.resolve('public')));

app.get("/", function(req, res){
    res.sendFile("/index.html",  {root: __dirname + '/public/'});
});

app.use("/", rtIndex);
app.use("/notes", rtNotes);

const hostname = '127.0.0.1';
const port = 3001;
app.listen(port, hostname, () => {  console.log(`Server running at http://${hostname}:${port}/`); });