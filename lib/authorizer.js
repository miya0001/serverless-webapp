'use strict';

exports.handler = ( event, context, callback ) => {
  const authorizationHeader = event.headers.Authorization;

  if ( ! authorizationHeader ) return callback( 'Unauthorized' );

  const encodedCreds = authorizationHeader.split(' ')[1];
  const plainCreds = ( new Buffer( encodedCreds, 'base64' ) ).toString().split( ':' );
  const username = plainCreds[0];
  const password = plainCreds[1];

  if ( ! ( username === 'admin' && password === 'secret' ) ) return callback( 'Unauthorized' );

  const authResponse = buildAllowAllPolicy( event, username );
  callback (null, authResponse );
};

const buildAllowAllPolicy = ( event, principalId ) => {
  const tmp = event.methodArn.split( ':' );
  const apiGatewayArnTmp = tmp[5].split( '/' );
  const awsAccountId = tmp[4];
  const awsRegion = tmp[3];
  const restApiId = apiGatewayArnTmp[0];
  const stage = apiGatewayArnTmp[1];
  const apiArn = `arn:aws:execute-api:${awsRegion}:${awsAccountId}:${restApiId}/${stage}/*/*`;
  const policy = {
    principalId: principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: [ apiArn ]
        }
      ]
    }
  };
  return policy;
};
