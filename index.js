const parser = require("./parser.js"),
  mailer = require("./mailer.js"),
  response = require("./response.js"),
  errorHandler = require("./error_handler");

exports.handler = async event => {
  try {
    const formInfo = await parser(event);
    const result = await mailer(formInfo);
    return await response(result);
  } catch (e) {
    const errorResult = await errorHandler(e);
    return await response(errorResult);
  }
};
