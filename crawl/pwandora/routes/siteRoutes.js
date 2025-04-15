const express = require('express');
const multer = require('multer');

const {
  createSiteAndProcess,
  saveSitesFromCsv,
} = require('../controllers/siteController.js');

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

/**
 * @swagger
 * /site/list:
 *   post:
 *     summary: CSV 파일을 이용한 사이트 저장
 *     description: 업로드된 CSV 파일을 파싱하여 사이트 정보를 저장합니다.
 *     tags:
 *       - SiteController
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: 업로드할 CSV 파일
 *     responses:
 *       200:
 *         description: CSV 파일이 성공적으로 처리됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "CSV 데이터가 성공적으로 저장되었습니다."
 */
router.post('/list', upload.single('file'), saveSitesFromCsv);

/**
 * @swagger
 * /site:
 *   post:
 *     summary: 사이트 등록 및 PWA 파이프라인 실행
 *     description: 사이트 주소를 등록하고 해당 주소로 PWA 파이프라인을 실행합니다.
 *     tags:
 *       - SiteController
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *                 example: "https://example.com"
 *                 description: 등록할 사이트의 URL
 *     responses:
 *       201:
 *         description: 사이트 등록 및 파이프라인 실행 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 site:
 *                   type: object
 *                   description: 등록된 사이트 정보
 *                 pipelineResult:
 *                   type: object
 *                   description: 파이프라인 처리 결과
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
router.post('/', createSiteAndProcess);

module.exports = router;
