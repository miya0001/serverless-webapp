'use strict';

const fs = require('fs');
const path = require('path');
const mime = require('mime/lite');
const isBinaryFile = require("isbinaryfile");

const root = 'public'

const fileExists = (file) => {
  try {
    fs.statSync(file)
    return true;
  } catch(e) {
    if(e.code === 'ENOENT') return false
  }
}

const errorMessage = (title, body) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>${title}</title>
  </head>
  <body>
    <h1>${title}</h1>
    <p>${body}</p>
  </body>
  </html>`
}

module.exports.handler = (params, event, context) => {
  const result = {
    statusCode: 404,
    body: errorMessage('404 Not Found', "The requested file was not found."),
    headers: {
      "Content-Type": "text/html"
    }    
  }

  if (fileExists(path.join(root, event.path))) {
    if (isBinaryFile.sync(path.join(root, event.path))) {
      result.statusCode = 500
      result.body = errorMessage('500 Internal Server Error', "It doesn't support binary.")
    } else {
      result.statusCode = 200
      result.headers["Content-Type"] = mime.getType(event.path)  
      result.body = fs.readFileSync(path.join(root, event.path), 'utf8')
    }
  }

  return result
}