'use strict';

module.exports.handler = (params, event, context) => {
  return {
    statusCode: 404,
    body: "Not Found",
    headers: {
      "Content-Type": "text/html"
    }
  }
}