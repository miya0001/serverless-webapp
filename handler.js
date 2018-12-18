'use strict';

const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')

const site = yaml.safeLoad(fs.readFileSync('./site.yml', 'utf8'))

const getHandler = (string) => {
  const handler = require(path.join(__dirname, string.split(/\./)[0]))
  return handler[string.split(/\./)[1]]
}

module.exports.app = (event, context, callback) => {
  const params = {
    site: site.site_meta,
    page: {},
    handler: getHandler(site.settings.defaultHandler),
  }

  for (const key in site.sitemap) {
    if (event.path.match(new RegExp(`^${key}$`))) {
      params.page = site.sitemap[key]
      if (site.sitemap[key].handler) {
        params.handler = getHandler(site.sitemap[key].handler)
      }
    }
  }

  callback(null, params.handler(params, event, context))
}
