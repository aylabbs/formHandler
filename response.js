module.exports = (result) => {
  var response = {
    "statusCode": 200,
    "body": result,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with",
      "Access-Control-Allow-Methods": "POST,GET,OPTIONS"
    }

  };
  return response;
};
