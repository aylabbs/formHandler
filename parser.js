const Busboy = require("busboy"),
  inspect = require("util").inspect,
  xss = require("xss"),
  errorHandler = require("./error_handler"),
  fileChecker = require("./file_checker");

module.exports = event => {
  const result = {};
  result.files = [];
  return new Promise((resolve, reject) => {
    let fileFinished,
      busboyFinished,
      noFileExists = true;
    const checkAllFinished = () => {
      if (busboyFinished && (fileFinished || noFileExists)) {
        resolve(result);
      }
    };
    try {
      const busboy = new Busboy({
        headers: event.headers
      });
      busboy.on("file", (fieldname, file, filename) => {
        file.on("error", e => {
          errorHandler(e);
        });

        // avoid empty files bug
        if (filename) {
          // don't resolve; there is a file
          noFileExists = false;
          // wait for it...
          fileFinished = false;
          // write to /tmp, check magic number to validate
          fileChecker(file, xss(filename), xss(fieldname))
            // resolves with file path
            .then(path => {
              result.files.push({ path });
              fileFinished = true;
              // will resolve if busboy has emitted "end"
              checkAllFinished();
            })
            .catch(e => reject(e));
        }
      });
      busboy.on("field", (fieldname, val) => {
        result[xss(fieldname)] = xss(val);
      });
      busboy.on("finish", () => {
        busboyFinished = true;
        // will resolve if no files queued
        checkAllFinished();
      });
      busboy.on("error", e => {
        console.log("Busboy error flag thrown");
        reject(e);
      });
      busboy.write(Buffer.from(event["body"].toString(), "base64"));
    } catch (e) {
      console.log(inspect(event));
      console.log("Parser error");
      reject(e);
    }
  });
};
