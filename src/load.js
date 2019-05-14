const fs = require('fs');
const path = require('path');
const Busboy = require('busboy');

const publicPath = path.resolve(__dirname, '../storage/public');

const loadFile = (req, res) => {
  const fileId = req.params.fileId;
  const filePathId = path.join(publicPath, fileId);

  fs.readdir(filePathId, (err, files) => {
    if (err) {
      return res.status(500).send(err.message);
    }

    const filename = files[0];
    const filepath = path.join(filePathId, filename);

    // ?
    res.set('Access-Control-Expose-Headers', 'Content-Disposition, Content-Length, Content-Type');
    res.set('Content-Disposition', `inline; filename="${filename}"`);

    return res.sendFile(filepath, { cacheControl: false }, (err) => {
      if (err) {
        if (res.headersSent) {
          console.log(err);
          return;
        }

        res.status(500).send(err.message);
      }
    });
  });
};

module.exports = { loadFile };
