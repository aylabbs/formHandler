const FileType = require("stream-file-type"),
  fs = require("fs");

module.exports = (stream, filename, fieldname) => {
  // e.g. /tmp/Resumes-JohnDoe.pdf
  let newFilePath = `/tmp/${fieldname}-${filename}`;
  let writeStream = fs.createWriteStream(newFilePath);
  return new Promise((resolve, reject) => {
    let streamComplete, fileTypeChecked;
    // verify file was written and filetype was emitted; then resolve
    const checkAllFinished = () => {
      if (streamComplete && fileTypeChecked) {
        resolve(newFilePath);
      }
    };
    writeStream.on("close", () => {
      streamComplete = true;
      checkAllFinished();
    });
    const detector = new FileType();
    stream.pipe(detector).pipe(writeStream);
    detector.on("file-type", fileType => {
      if (fileType.mime === "application/pdf") {
        fileTypeChecked = true;
      } else {
        console.log("Wrong format: " + fileType);
        reject(new Error("invalid format"));
      }
      checkAllFinished();
    });
  });
};
