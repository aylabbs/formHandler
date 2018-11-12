const aws = require("aws-sdk"),
  ses = new aws.SES(),
  nodemailer = require("nodemailer"),
  inspect = require("util").inspect,
  website = ""; // name of project

module.exports = error => {
  return new Promise((resolve, reject) => {
    console.log("ERROR HANDLER RAN!");
    console.log(inspect(error));
    let message;
    switch (error.message) {
      case "Missing Content-Type":
        message =
          "We're sorry. We ran into a problem. Please resubmit the form. If the problem persists, try a different browser.";
        break;
      case "empty":
        message =
          "We're sorry. We ran into a problem. Please resubmit the form. If the problem persists, try a different browser.";
        break;
      case "invalid format":
        message =
          "Sorry, there was an issue with the file you submitted. Please submit a valid PDF file.";
        break;
      default:
        message = "Sorry, something went wrong. Please try again.";
        break;
    }
    const messageResponse = `<div class="container">
    <div class="row">
      <div class="col-md-12 col-sm-12 col-lg-12 animated fadeInLeft">
        <h3 class="text-danger">Something went wrong</h3>
        <h5>${message}</h5>
        <div class="paragraph-section" style="text-align: justify; 
        -moz-text-align-last: center; 
        text-align-last: center;">
          <p>If the problem persists, let us know.</p>
        </div>
        
      </div>
    </div>
  </div>`;

    const mailOptions = {
      from: "SES VERIFIED EMAIL",
      subject: `An Error has occurred at ${website} Form Handler`,
      html: `<h3>There has been an error</h3><p>in the Lambda function handling form submissions for ${website}.</p><br /><p>${error}`,
      to: ["SES VERIFIED EMAIL", "ANOTHER SES VERIFIED EMAIL"]
    };
    const transporter = nodemailer.createTransport({
      SES: ses
    });
    const response = {};
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log("Hmm.. What went wrong?");
        throw err;
      } else {
        response.status = 400;
        response.body = messageResponse;
        resolve(response);
      }
    });
  });
};
