const schedule = require('node-schedule');
const trancoService = require('../services/core/trancoService');
const { models } = require('../config/dbConfig');
const { runPipeLine } = require('../services/process/pipelineService');

class DailyScheduler {
    constructor() {
        this.job = null;
    }

    async runDailyTasks() {
        try {
            // 1. Tranco URL 수집
            console.log('Tranco 리스트 수집 시작:', new Date());
            await trancoService.syncLatestTrancoList();
            console.log('Tranco 리스트 수집 완료:', new Date());

            // 2. PWA 파이프라인 실행
            console.log('PWA 체크 시작:', new Date());
            const uncensoredSites = await models.site.findAll({
                attributes: ['id', 'url'],
                where: { status: 'NONE' },
            });
            const result = await runPipeLine(uncensoredSites);
            console.log('PWA 체크 완료:', new Date());

        } catch (error) {
            console.error('일일 작업 실행 중 오류 발생:', error);
        }
    }

    startDailyJob(hour = 3, minute = 0) {
        // 한국 시간 기준으로 실행
        this.job = schedule.scheduleJob(`${minute} ${hour} * * *`, async () => {
            console.log('일일 작업 시작:', new Date());
            await this.runDailyTasks();
        });
        console.log(`일일 작업 스케줄러 설정 완료 (매일 ${hour}:${minute}에 실행)`);
    }

    stopJob() {
        if (this.job) {
            this.job.cancel();
            this.job = null;
            console.log('일일 작업 스케줄러 중지');
        }
    }
}

module.exports = new DailyScheduler();