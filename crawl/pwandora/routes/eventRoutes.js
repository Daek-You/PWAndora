const express = require('express');
const router = express.Router();
const { handleEventRequest } = require('../controllers/eventController');

/**
 * @swagger
 * /events:
 *   post:
 *     summary: PWA 이벤트 처리
 *     description: 주어진 homepageUrl에서 이벤트 페이지를 찾아 스크린샷, OCR, 요약, 이미지 생성 후 결과를 반환하고 저장합니다.
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pwaId
 *             properties:
 *               pwaId:
 *                 type: integer
 *                 example: 123
 *                 description: PWA 식별자
 *     responses:
 *       200:
 *         description: 이벤트 처리 결과 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     description:
 *                       type: string
 *                     startAt:
 *                       type: string
 *                       format: date-time
 *                     endAt:
 *                       type: string
 *                       format: date-time
 *                     imageUrl:
 *                       type: string
 *                       format: uri
 *                     pwaId:
 *                       type: integer
 *       400:
 *         description: 필수 파라미터 누락
 *       500:
 *         description: 서버 내부 오류
 */
router.post('/', handleEventRequest);

module.exports = router;
