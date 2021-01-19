const s3 = require('../s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const crypto = require('crypto');
const { S3_BUCKET_NAME } = require('../config');

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: S3_BUCKET_NAME,
    key: function (req, file, cb) {
      console.log(file);
      const ext = file.originalname.split('.')[
        file.originalname.split('.').length - 1
      ];
      const hash = crypto
        .createHash('sha256')
        .update(file.originalname)
        .digest('hex');
      const key = `${hash}.${ext}`;
      cb(null, key);
    },
  }),
});

module.exports = upload;
