// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger 문서 옵션 설정
const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'PWAndora Crawler API',
      description: 'PWA 앱을 수집하고 데이터베이스에 저장하는 API',
      version: '1.0.0',
    },
    servers: [
      {
        url: process.env.SERVER_URL + '/api',
        description:
          process.env.NODE_ENV === 'production' ? '운영 서버' : '개발 서버',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

// Swagger 스펙 생성
const swaggerSpec = swaggerJSDoc(options);

// Express 앱에 Swagger 미들웨어 설정
module.exports = (app) => {
  // Swagger JSON 엔드포인트
  app.get('/api-docs/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Swagger UI 설정
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: {
        url: `${process.env.SERVER_URL}/api-docs/swagger.json`,
      },
    })
  );
};
