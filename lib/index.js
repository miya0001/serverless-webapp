'use strict';

module.exports.handler = (params, event, context) => {
  return {
    statusCode: 200,
    body: "Welcome",
    headers: {
      "Content-Type": "text/html"
    }
  }
}