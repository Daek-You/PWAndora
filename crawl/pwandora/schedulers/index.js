const dailyScheduler = require('./dailyScheduler');

const initializeSchedulers = () => {
    // 한국 시간 기준 새벽 3시에 실행
    dailyScheduler.startDailyJob(3, 0);
    console.log('스케줄러 초기화 완료');
};

module.exports = { initializeSchedulers };