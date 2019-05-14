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

    // set file headers
    res.set('Access-Control-Expose-Headers', 'Content-Disposition, Content-Length');
    res.attachment(files[0]);

    return res.sendFile(files[0], {
      root: filePathId,
      cacheControl: false,
    });
  });
};

module.exports = { loadFile };
