// redisConfig.js
const redis = require('redis');
const dotenv = require('dotenv');

dotenv.config();

// Redis 클라이언트 생성 함수
const createRedisClient = async () => {
  const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST || 'redis'}:${process.env.REDIS_PORT || 6379}`,
    password: process.env.REDIS_PASSWORD
  });

  // 이벤트 리스너 설정
  redisClient.on('error', (err) => {
    console.error('Redis Error:', err);
  });

  redisClient.on('connect', () => {
    console.log('Connected to Redis server');
  });

  // Redis 연결
  await redisClient.connect();
  
  return redisClient;
};

module.exports = { createRedisClient };