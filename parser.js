var Busboy = require('busboy');

module.exports = (event) => {
  return new Promise((resolve, reject) => {
    var result = {};
    if (event.headers) {
      var busboy = new Busboy({
        headers: event.headers
      });


      busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if (!result[fieldname]) {
          result[fieldname] = [];
        }
        if (result[fieldname].length > 0) {
          result[fieldname].push({
            filename: filename,
            content: file
          });
        }
      });
      busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) => {
        result[fieldname] = val;
      });
      busboy.on('finish', () => {});
      busboy.write(Buffer.from(event['body'].toString(), 'base64'));
    }

    if (Object.keys(result).length == 0) {
      resolve("nothing here");
    } else {
      resolve(result);
    }
  });
};
