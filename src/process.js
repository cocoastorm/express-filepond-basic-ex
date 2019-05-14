const fs = require('fs');
const path = require('path');
const Busboy = require('busboy');
const uuid = require('uuid/v4');

const publicPath = path.resolve(__dirname, '../storage/public');
const privatePath = path.resolve(__dirname, '../storage/private');

const processFile = (req, res) => {
  const id = uuid();
  const busboy = new Busboy({ headers: req.headers });

  const wsPath = (id, filename) => {
    const processDir = path.join(privatePath, id);
    
    return {
      dirpath: processDir,
      filepath: path.join(processDir, filename), 
    };
  };

  // handle file upload
  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    const { dirpath, filepath } = wsPath(id, filename);

    fs.mkdir(dirpath, (err) => {
      if (err && err.code != 'EEXIST') {
        return res.status(500).send(err.message);
      }

      const ws = fs.createWriteStream(filepath);
      file.pipe(ws);
    });
  });

  // send file id after uploading
  busboy.on('finish', () => res.send(id));
  
  // let busboy do most of the work
  req.pipe(busboy);
};

const submitFile = (req, res) => {
  const busboy = new Busboy({ headers: req.headers });

  busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) => {
    const fileId = val.toString().trim();

    const private = path.join(privatePath, fileId);
    const public = path.join(publicPath, fileId); 

    if (fieldname !== 'serverId') {
      res.status(400).send('require server id');
    }
    
    fs.access(private, (err) => {
      if (err) {
        return res.status(404).send('Not Found');
      }

      fs.rename(private, public, (err) => {
        if (err) {
          return res.status(500).send('Server Error');
        }

        return res.status(204).end();
      });
    });
  });

  req.pipe(busboy);
};

module.exports = {
  processFile,
  submitFile,
};