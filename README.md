# formHandler
Simple Node.js endpoint for AWS Lambda that handles multipart forms with attachments, sending an email with their contents


# What is this for?

Any developer designing mostly static websites and in need of a simple and (basically) free and secure method of handling contact forms with attachments.
This will work without attachments as well, obviously.

# What are the limitations?

Filesize. AWS Lambda supports payloads up to 5mb so that is the largest size file or sum of files you can handle in one go. 
You may well want to check that on the frontend before submitting.


# What do I need?

An AWS account in a region that supports all 3 of the AWS components necessary to make this work. 
(I used US-N Virginia, as US-Ohio didn't support SES).

# What do I need to setup?

- Validate your email address in SES (the email you will send from and receive to)
- Configure an AWS IAM role with full permissions for all of the components we are using (SES, API G, CloudWatch for logs)
- Create a Lambda function from the template for node-hello-world, assign the IAM role above, use latset Node ver
- Configure an API Gateway endpoint
  - create a POST method
  - set it to proxy to Lambda, choose your func created above
  - in settings enable binary support, type in 'multipart/form-data' and save
  - enable CORS
  - deploy (use the provided link to endpoint in form script onSubmit)
- Init cloned app in npm to pull required modules, then zip all contents in root dir of app
- Upload zip in Lambda designer where it says edit code inline, select the other option to upload zip
- Change variables in code to match your form fields and verified email address

# Todo

- Make prettier email
- Validate fields 
- Useful error handling
