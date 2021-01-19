const express = require('express');
const router = express.Router();
const upload = require('../../middlewares/upload');
const s3 = require('../../s3');
const sharp = require('sharp');
const { S3_BUCKET_NAME } = require('../../config');
const apicache = require('apicache');
const cache = apicache.middleware;

router.get('/:key', cache('24 hours'), async (req, res, done) => {
  const { key } = req.params;
  const { w, h } = req.query;
  const width = parseInt(w);
  const height = parseInt(h);

  const params = {
    Bucket: S3_BUCKET_NAME,
  };

  if (w && h) {
    const keyArr = key.split('.');
    const hash = keyArr[0];
    const ext = keyArr[1];
    params['Key'] = `${hash}-${width}x${height}.${ext}`;
  } else {
    params['Key'] = key;
  }

  try {
    // Check if the requested image exists in S3
    await s3.headObject(params).promise();

    // If the image exists in S3, redirect to the URL for the resource
    const url = `https://gareth-lau-image-repo.s3.us-east-2.amazonaws.com/${key}`;
    return res.redirect(url);
  } catch (error) {
    if (error.statusCode === 404) {
      // Requested image does not exist in S3, attempt to create it using the source image
      let data;
      try {
        data = await s3
          .getObject({ Key: key, Bucket: S3_BUCKET_NAME })
          .promise();
      } catch (error) {
        if (error.statusCode === 404) {
          // Source image does not exist
          return res.status(404).send();
        } else {
          return res.status(500).send();
        }
      }

      // Resize width and height
      const buffer = Buffer.from(data.Body, 'binary');
      const resizedBuffer = await sharp(buffer)
        .jpeg({ quality: 80 })
        .resize(width, height)
        .toBuffer();

      const keyArr = key.split('.');
      const hash = keyArr[0];
      const ext = 'jpg'; // The extension must be jpg

      // Save the resized image
      await s3
        .putObject({
          Body: resizedBuffer,
          Key: `${hash}-${width}x${height}.${ext}`,
          Bucket: S3_BUCKET_NAME,
        })
        .promise();

      const url = `https://gareth-lau-image-repo.s3.us-east-2.amazonaws.com/${hash}-${width}x${height}.${ext}`;

      return res.redirect(url);
    }
  }
});

router.post('/', upload.array('images'), (req, res, done) => {
  return res.status(200).send(req.files);
});

module.exports = router;
