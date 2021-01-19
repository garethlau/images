const AWS = require('aws-sdk');
const { AWS_SECRET_KEY_ID, AWS_SECRET_ACCESS_KEY } = require('../config');

AWS.config.update({
  accessKeyId: AWS_SECRET_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
  region: 'us-east-2',
});

const s3 = new AWS.S3();
module.exports = s3;
