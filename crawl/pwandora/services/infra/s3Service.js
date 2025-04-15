const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getFilePath } = require('../../middlewares/upload');
const s3 = require('../../config/s3Config');

// S3에 파일 업로드
const uploadToS3 = async (appName, fileName, fileBuffer) => {
  const bucketName = process.env.S3_BUCKET_NAME;
  const filePath = getFilePath(appName, fileName);

  const uploadParams = {
    Bucket: bucketName,
    Key: filePath,
    Body: fileBuffer,
  };

  const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${filePath}`;

  try {
    await s3.send(new PutObjectCommand(uploadParams));
    return fileUrl;
  } catch (error) {
    throw new Error('File upload failed.');
  }
};

// S3에서 파일 삭제
const deleteFromS3 = async (filePath) => {
  const bucketName = process.env.S3_BUCKET_NAME;
  const deleteParams = {
    Bucket: bucketName,
    Key: filePath,
  };

  try {
    await s3.send(new DeleteObjectCommand(deleteParams));
    return true;
  } catch (error) {
    console.error('S3 삭제 실패:', error);
    throw new Error('파일 삭제에 실패했습니다.');
  }
};

module.exports = { uploadToS3, deleteFromS3 };
