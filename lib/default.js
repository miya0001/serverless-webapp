'use strict';

const fs = require('fs');
const path = require('path');
const mime = require('mime/lite');

const root = 'public'

const fileExists = (file) => {
  try {
    fs.statSync(file)
    return true;
  } catch(e) {
    if(e.code === 'ENOENT') return false
  }
}

module.exports.handler = (params, event, context) => {
  const result = {
    statusCode: 404,
    body: "Not Found",
    headers: {
      "Content-Type": "text/html"
    }    
  }

  if (fileExists(path.join(root, event.path))) {
    result.statusCode = 200
    result.headers["Content-Type"] = mime.getType(event.path)
    result.body = fs.readFileSync(path.join(root, event.path), 'utf8')
  }

  return result
}