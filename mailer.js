var aws = require('aws-sdk');
var ses = new aws.SES();
var nodemailer = require('nodemailer');

module.exports = (result) => {
  return new Promise((resolve, reject) => {
    if (typeof result !== 'string') {
      var mailOptions = {
        from: 'INSERT SES VERIFIED EMAIL',
        subject: `You got an inquiry from ${result.name}`,
        html: `<h3>You got a contact message</h3> <p><b>From: </b>${result.name} <br /> <b>Subject: </b>${result.subject} <br /> <b>Message: </b>${result.message}</p>`,
        to: 'INSERT SES VERIFIED EMAIL', //can be array
        attachments: result.upload
      };

      var transporter = nodemailer.createTransport({
        SES: ses
      });

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          resolve(err);
        } else {
          resolve("Success");
        }
      });
    } else {
      resolve(result);
    }
  });
};
