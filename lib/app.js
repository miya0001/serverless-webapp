const express = require( 'express' );
const awsServerlessExpressMiddleware = require( 'aws-serverless-express/middleware' );
const app = express()

app.use( awsServerlessExpressMiddleware.eventContext() )

app.get( "/", ( req, res, next ) => {
  res.send('Wow!')
});

app.get( "/debug", ( req, res, next ) => {
  res.json( req.apiGateway.event )
});

module.exports = app;
