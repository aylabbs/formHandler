module.exports = result => {
  const response = {
    statusCode: result.status,
    body: result.body,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with",
      "Access-Control-Allow-Methods": "POST,GET,OPTIONS"
    }
  };
  return response;
};
