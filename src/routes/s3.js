const express = require('express');
const { S3Client } = require('@aws-sdk/client-s3');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const router = express.Router();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

router.post('/presigned-url', async (req, res) => {
  const { fileName, fileType } = req.body;

  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    ContentType: fileType,
  };

  try {
    const command = new PutObjectCommand(s3Params);
    const url = await getSignedUrl(s3, command, { expiresIn: 60 }); // URL válida por 60 segundos
    res.json({ url });
  } catch (err) {
    console.error('Error al generar la URL pre-firmada', err);
    return res.status(500).json({ error: 'Error al generar la URL pre-firmada' });
  }
});

module.exports = router;

