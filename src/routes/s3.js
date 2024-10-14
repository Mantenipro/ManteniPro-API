const express = require('express');
const AWS = require('aws-sdk');
const router = express.Router();


const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});


router.post('/presigned-url', (req, res) => {
  const { fileName, fileType } = req.body;

  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Expires: 60, 
    ContentType: fileType,
  };


  s3.getSignedUrl('putObject', s3Params, (err, url) => {
    if (err) {
      console.error('Error al generar la URL pre-firmada', err);
      return res.status(500).json({ error: 'Error al generar la URL pre-firmada' });
    }
    res.json({ url });
  });
});

module.exports = router;
