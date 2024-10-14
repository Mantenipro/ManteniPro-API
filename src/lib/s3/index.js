const s3 = require('./config');

const generatePresignedUrl = async (fileName, fileType) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME, 
    Key: fileName,
    Expires: 60 * 5,
    ContentType: fileType, 
  };

  try {
    const url = await s3.getSignedUrlPromise('putObject', params); 
    return url;
  } catch (err) {
    console.error('Error generando URL firmada:', err);
    throw new Error('No se pudo generar la URL firmada');
  }
};

module.exports = {
  generatePresignedUrl,
};
