const express = require('express');
const { collectUrlsHandler } = require('../controllers/trancoController');

const router = express.Router();

/**
 * @swagger
 * /tranco/collecturls:
 *   post:
 *     summary: Tranco 리스트에서 URL 수집 및 DB저장
 *     description: 최신 Tranco 리스트를 다운로드하고 새로운 URL을 DB에 저장
 *     tags: [Tranco]
 *     responses:
 *       200:
 *         description: URL 수집 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Tranco 리스트 수집 및 처리 완료'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'Tranco 리스트 수집 중 오류 발생'
 *                 error:
 *                   type: string
 */
router.post('/collecturls', collectUrlsHandler);

module.exports = router;
