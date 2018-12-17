'use strict';

module.exports.handler = (params, event, context) => {
  return {
    statusCode: 200,
    body: params.page.title,
    headers: {
      "Content-Type": "text/html"
    }
  }
}