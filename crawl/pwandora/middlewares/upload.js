const multer = require('multer');
const path = require('path');

// 메모리에 저장
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB 제한
  fileFilter: (req, file, cb) => {
    const allowedExtensions = /jpeg|jpg|png|gif|wgt|apk/;
    const extname = allowedExtensions.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedExtensions.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb(new Error('파일 확장자 확인이 필요합니다.'));
    }
  },
});

// 파일 경로 설정
const getFilePath = (appName, fileName) => {
  const ext = path.extname(fileName).toLowerCase();
  let filePath;

  if (ext === '.jpg' || ext === '.png' || ext === '.jpeg') {
    filePath = `apps/${appName}/images/${fileName}`;
  } else {
    filePath = `apps/${appName}/${fileName}`;
  }

  console.log(`파일 경로: ${filePath}`);
  return filePath;
};

module.exports = { upload, getFilePath };
