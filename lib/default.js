'use strict';

const fs = require('fs');
const path = require('path');
const mime = require('mime/lite');
const isBinaryFile = require("isbinaryfile");
const ejs = require('ejs')

const staticRoot = 'public'
const templateRoot = 'templates'

const fileExists = (file) => {
  try {
    fs.statSync(file)
    return true;
  } catch(e) {
    if(e.code === 'ENOENT') return false
  }
}

const errorMessage = (title, body) => {
  return render('error.html', {
    title: title,
    body: body,
  })
}

const render = (template, data) => {
  const html = fs.readFileSync(path.join(templateRoot, template), 'utf8')
  return ejs.render(html, data)
}

module.exports.handler = (params, event, context) => {
  const result = {
    statusCode: 404,
    body: errorMessage('404 Not Found', "The requested file was not found."),
    headers: {
      "Content-Type": "text/html"
    }    
  }

  if (!params.page && fileExists(path.join(staticRoot, event.path))) {
    if (isBinaryFile.sync(path.join(staticRoot, event.path))) {
      result.statusCode = 500
      result.body = errorMessage('500 Internal Server Error', "It doesn't support binary.")
    } else {
      result.statusCode = 200
      result.headers["Content-Type"] = mime.getType(event.path)
      result.body = fs.readFileSync(path.join(staticRoot, event.path), 'utf8')
    }
  } else if (Object.keys(params.page).length) {
    let template = "default.html"
    if (params.page.template && fileExists(path.join(templateRoot, params.page.template))) {
      template = params.page.template
    }
    result.statusCode = 200
    params.event = event
    result.body = render(template, params)
  }

  return result
}