'use strict';

const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')

const map = yaml.safeLoad(fs.readFileSync('./site.yml', 'utf8'))

const getHandler = (string) => {
  const handler = require(path.join(__dirname, string.split(/\./)[0]))
  return handler[string.split(/\./)[1]]
}

module.exports.app = (event, context, callback) => {
  let handler = getHandler(map.defaultHandler)
  let params = {}

  for (const key in map.sitemap) {
    if (event.path.match(new RegExp(`^${key}$`))) {
      params = map.sitemap[key]
      handler = getHandler(map.sitemap[key].handler)
    }
  }

  callback(null, handler(params, event, context))
}