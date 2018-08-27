var parser = require('./parser.js');
var mailer = require('./mailer.js');
var response = require('./response.js');

exports.handler = (event, context, callback) => {
  parser(event)
  .then(result => mailer(result))
  .then(result => response(result))
  .then(result => callback(null, result));
};

 
