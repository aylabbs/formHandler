const Busboy = require("busboy"),
  inspect = require("util").inspect,
  xss = require("xss"),
  FileType = require("stream-file-type"),
  fs = require("fs");

module.exports = event => {
  const result = {};
  const promises = [];
  result.files = [];
  return new Promise((resolve, reject) => {
    try {
      const busboy = new Busboy({
        headers: event.headers
      });

      busboy.on("file", (fieldname, file, filename) => {
        // each file creates a unique promise. resolves on empty file
        // or filetype match and write stream complete
        promises.push(
          new Promise((resolve, reject) => {
            file.on("error", e => {
              reject(e);
            });

            // avoid empty files bug
            if (filename) {
              const filePromises = [];
              // e.g. /tmp/Resumes-JohnDoe.pdf
              let path = `/tmp/${fieldname}-${filename}`;
              let writeStream = fs.createWriteStream(path);
              // promise a file will be saved
              filePromises.push(
                new Promise((resolve, reject) => {
                  writeStream.on("close", () => {
                    resolve(path);
                  });
                })
              );
              // promise a filetype
              filePromises.push(
                new Promise((resolve, reject) => {
                  const detector = new FileType();
                  file.pipe(detector).pipe(writeStream);
                  detector.on("file-type", fileType => {
                    resolve(fileType.mime);
                  });
                })
              );
              // check type and resolve file if matches
              Promise.all(filePromises)
                .then(arr => {
                  if (arr[1] === "application/pdf") {
                    result.files.push({ path: arr[0] });
                    resolve("Correct filetype");
                  } else {
                    reject(new Error("invalid format"));
                  }
                })
                .catch(e => reject(e));
            } else {
              // continue. no file
              file.resume();
              resolve("empty file");
            }
          })
        );
      });
      // promise values. resolve when busboy finishes
      promises.push(
        new Promise((resolve, reject) => {
          busboy.on("field", (fieldname, val) => {
            result[xss(fieldname)] = xss(val);
          });
          // all files will have been emitted and added to promise list
          // awaiting list ensures they all conditionally resolve in a completed stream
          busboy.on("finish", () => {
            resolve("Busboy ended");
          });
          busboy.on("error", e => {
            reject(e);
          });
        })
      );

      busboy.write(Buffer.from(event["body"].toString(), "base64"));
      // catch busboy error
    } catch (e) {
      console.log(inspect(event));
      console.log("Parser error");
      reject(e);
    }
    Promise.all(promises)
      .then(arr => {
        resolve(result);
      })
      .catch(e => reject(e));
  });
};
