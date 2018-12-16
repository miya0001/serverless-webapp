'use strict';

module.exports.app = (event, context, callback) => {
  callback(null, { 
    statusCode: 200, 
    body: `<html><head><title>Hello World</title></head><body><h1>Hello World!</h1><pre style="background-color: #f5f5f5; padding: 10px; border: 1px solid #dedede;">${JSON.stringify(event, null, 2)}</pre></body></html>`, 
    headers: { 
        "Content-Type": "text/html" 
      } 
    }
  );
}