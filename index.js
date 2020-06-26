import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

import {rtIndex} from './routes/index';
import {rtNotes} from './routes/notes';

const app = express();

app.use(express.static(path.resolve('public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", rtIndex);
app.use("/notes", rtNotes);

const hostname = '127.0.0.1';
const port = 3001;
app.listen(port, hostname, () => {  console.log(`Server running at http://${hostname}:${port}/`); });