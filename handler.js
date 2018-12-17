'use strict';

const AWS = require('aws-sdk');
const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')

const getHandler = (string) => {
  const handler = require(path.join(__dirname, string.split(/\./)[0]))
  return handler[string.split(/\./)[1]]
}

module.exports.app = (event, context, callback) => {
  const s3 = new AWS.S3()
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: "site.yml"
  };
  s3.getObject(params, (err, data) => {
    const site = yaml.safeLoad(data.Body.toString('utf-8'))

    let handler = getHandler(site.defaultHandler)
    let args = {
      site: site,
      page: {}
    }
  
    for (const key in site.sitemap) {
      if (event.path.match(new RegExp(`^${key}$`))) {
        args.page = site.sitemap[key]
        handler = getHandler(site.sitemap[key].handler)
      }
    }
  
    callback(null, handler(args, event, context))
  })
}