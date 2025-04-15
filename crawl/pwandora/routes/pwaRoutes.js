const express = require('express');
const {
  runPipelineHandler,
} = require('../controllers/pwaController.js');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: PWA
 *   description: PWA 크롤링 및 패키징 API
 */

/**
 * @swagger
 * /pwa:
 *   post:
 *     summary: PWA 크롤링 및 Tizen 패키징 파이프라인 실행
 *     tags: [PWA]
 *     description: |
 *       웹사이트를 크롤링하여 PWA 여부를 확인하고,
 *       PWA인 경우 Tizen 앱으로 패키징하는 전체 프로세스를 실행합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstId:
 *                 type: integer
 *                 description: 처리할 시작 사이트 ID
 *                 example: 101
 *               lastId:
 *                 type: integer
 *                 description: 처리할 마지막 사이트 ID
 *                 example: 120
 *     responses:
 *       200:
 *         description: 파이프라인 실행 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 executionTime:
 *                   type: string
 *                   description: 전체 실행 소요 시간
 *                   example: "123.45초"
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: 사이트 ID
 *                       developer_site:
 *                         type: string
 *                         description: 개발자 사이트 URL
 *                       website_url:
 *                         type: string
 *                         description: PWA 웹사이트 URL
 *                       start_url:
 *                         type: string
 *                         description: PWA 시작 URL
 *                       name:
 *                         type: string
 *                         description: PWA 이름
 *                       display:
 *                         type: string
 *                         description: 디스플레이 모드
 *                       icon_image:
 *                         type: string
 *                         description: 아이콘 이미지 URL
 *                       file_size:
 *                         type: string
 *                         description: 패키징된 파일 크기
 *                       download_url:
 *                         type: string
 *                         description: 패키징된 파일 다운로드 URL
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 오류 메시지
 *                 executionTime:
 *                   type: string
 *                   description: 실행 중단까지 소요된 시간
 *                 error:
 *                   type: string
 *                   description: 상세 오류 내용
 */
router.post('/', runPipelineHandler);

module.exports = router;
