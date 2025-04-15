const express = require('express');
const {
  getCurrentStatus,
  connectMonitoringSse,
} = require('../controllers/monitoringController');

const router = express.Router();

/**
 * @swagger
 * /monitoring/status:
 *   get:
 *     summary: 파이프라인 상태 확인
 *     tags: [Monitoring]
 *     description: |
 *       파이프라인 상태를 확인합니다.
 */
router.get('/status', getCurrentStatus);

/**
 * @swagger
 * /monitoring/sse:
 *   get:
 *     summary: SSE를 통한 실시간 모니터링 연결
 *     tags: [Monitoring]
 *     description: |
 *       실시간 PWA 처리 현황을 확인하기 위한 SSE(Server-Sent Events) 스트림을 연결합니다.
 *       클라이언트는 EventSource를 사용하여 이 엔드포인트에 연결해야 합니다.
 *     responses:
 *       200:
 *         description: SSE 연결 성공 (stream이 계속 유지됨)
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: string
 *               example: |
 *                 event: connected
 *                 data: {"message":"SSE 연결 성공"}
 */
router.get('/sse', connectMonitoringSse);
module.exports = router;
