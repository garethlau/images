const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_SECRET_KEY_ID: process.env.AWS_SECRET_KEY_ID,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
};
