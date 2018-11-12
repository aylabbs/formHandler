const aws = require("aws-sdk"),
  ses = new aws.SES(),
  fs = require("fs"),
  nodemailer = require("nodemailer");

module.exports = result => {
  return new Promise((resolve, reject) => {
    try {
      if (Object.keys(result).length === 0) {
        reject(new Error("empty"));
      }
      const template = require("./email_template.js")(result);
      const response = {};
      const mailOptions = {
        from: "SES VERIFIED EMAIL",
        subject: template.subject,
        replyTo: result.email,
        text: template.text,
        html: template.html,
        to: ["SES VERIFIED EMAIL", "ANOTHER SES VERIFIED EMAIL"],
        attachments: result.files
      };
      const transporter = nodemailer.createTransport({
        SES: ses
      });

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          reject(err);
        } else {
          console.log("Mailer sent successfully");
          response.status = 200;
          response.body = template.responseBody;
          for (const file of result.files) {
            fs.unlinkSync(file.path);
          }

          resolve(response);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};
