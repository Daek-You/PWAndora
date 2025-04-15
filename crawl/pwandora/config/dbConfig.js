const { Sequelize } = require('sequelize');
const initModels = require('../models/init-models.js');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  logging: false,
  timezone: '+09:00',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  define: {
    timestamps: true,
    underscored: true,
  },
});

// 모델 초기화
const models = initModels(sequelize);

// `sequelize` 인스턴스를 models에 추가
models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = { sequelize, models };
