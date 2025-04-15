const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const swaggerSetup = require('./config/swagger');
const siteRoutes = require('./routes/siteRoutes.js');
const pwaRoutes = require('./routes/pwaRoutes.js');
const emailRoutes = require('./routes/emailRoutes.js');
const trancoRoutes = require('./routes/trancoRoutes.js');
const monitoringRoutes = require('./routes/monitoringRoutes.js');
const eventRoutes = require('./routes/eventRoutes');

const { createRedisClient } = require('./config/redisConfig');
const { initializeSchedulers } = require('./schedulers');
const dailyScheduler = require('./schedulers/dailyScheduler');
const cors = require('cors');
const path = require('path');
const { registerServices } = require('./services');
const { sequelize } = require('./config/dbConfig.js');
const PipelineStatusService = require('./services/redis/pipelineStatusService');
const SiteStatusService = require('./services/redis/siteStatusService');
const TrancoService = require('./services/core/trancoService');

const app = express();
const port = process.env.PORT || 3000;

swaggerSetup(app);

app.use(
  cors({
    origin: '*', //추후 모니터링 페이지만 열어둘 것
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/site', siteRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/pwa', pwaRoutes);
app.use('/api/tranco', trancoRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/events', eventRoutes);

// 데이터베이스 연결과 서버 시작 전에 Redis 클라이언트 초기화
sequelize
  .authenticate()
  .then(async () => {
    console.log('데이터베이스 연결 성공');

    // Redis 클라이언트 초기화
    try {
      const redisClient = await createRedisClient();
      app.set('redisClient', redisClient);

      const pipelineStatusService = new PipelineStatusService(redisClient);
      const siteStatusService = new SiteStatusService(redisClient);
      const trancoService = TrancoService.getInstance(redisClient);

      app.set('pipelineStatusService', pipelineStatusService);
      app.set('siteStatusService', siteStatusService);
      app.set('trancoService', trancoService);

      registerServices({
        site: siteStatusService,
        pipeline: pipelineStatusService,
        tranco: trancoService,
      });

      console.log('Redis client initialized');
      console.log('서비스 등록 완료: ', {
        pipeline: !!pipelineStatusService,
        site: !!siteStatusService,
        tranco: !!trancoService,
      });

      // 서버 종료 시 스케줄러와 Redis 연결 종료
      process.on('SIGINT', async () => {
        dailyScheduler.stopJob();
        await redisClient.quit();
        console.log('Redis connection closed');
        process.exit(0);
      });
    } catch (error) {
      console.error('Failed to initialize Redis client:', error);
      // Redis 연결 실패해도 서버는 계속 실행
    }

    return sequelize.sync();
  })
  .then(() => {
    console.log('테이블 연동 성공');
    // initializeSchedulers(); // 스케줄러 초기화
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('데이터베이스 연결 실패:', error);
  });
