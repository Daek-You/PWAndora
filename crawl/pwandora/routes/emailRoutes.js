const express = require('express')
const { sendEmail } = require('../controllers/emailController')

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Email
 *   description: Email 전송 API
 */

/**
 * @swagger
 * /email:
 *   post:
 *     summary: Email 전송
 *     tags: [Email]
 *     description: |
 *       관리자에게 이메일을 전송합니다.
 */
router.post('/', sendEmail)

module.exports = router
