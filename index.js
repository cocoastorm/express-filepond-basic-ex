const path = require('path');
const express = require('express');

const { processFile, submitFile } = require('./src/process');
const { loadFile } = require('./src/load');

const app = express();
const port = process.env.PORT || 3000;

// oh hello
// app.get('/', (req, res) => res.send('Filepond Example with Express'));
app.get('/', (req, res) => res.sendFile(path.resolve(__dirname, './index.html')));
app.use(
  express.static(
    path.resolve(__dirname, './assets'),
  ),
);

// file upload processing
app.post('/file/process', processFile);
app.post('/file/submit', submitFile);
app.get('/file/:fileId/load', loadFile);

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
