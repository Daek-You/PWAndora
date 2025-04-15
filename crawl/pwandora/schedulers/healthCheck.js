const schedule = require('node-schedule');
const { sendEmailsToManagers } = require('../services/email/emailService');
const { getPipelineStatusService } = require('../services');
const MAX_STOPPED_MIN = 10;

class HealthCheckScheduler {
  constructor() {
    this.job = null;
    this.lastLogTime = new Date();
    this.emergencyEmailSent = false;
  }

  updateLastLogTime() {
    this.lastLogTime = new Date();
  }

  updateEmergencyEmailSent(status) {
    this.emergencyEmailSent = status;
  }

  async runTasks() {
    try {
      // 크롤러 로그 상태 확인
      const currentTime = new Date();
      console.log('Last Crawler Logtime', this.lastLogTime);

      const timeDiff = this.lastLogTime
        ? // ? Math.floor((currentTime - this.lastLogTime) / 1000) // test: 분 => 초
          Math.floor((currentTime - this.lastLogTime) / 1000 / 60)
        : null;

      if (timeDiff !== null && timeDiff >= MAX_STOPPED_MIN) {
        console.log(`last crawler log: ${timeDiff}min ago`);
        if (this.emergencyEmailSent)
          console.log('emergency Email is already sent.');
        if (!this.emergencyEmailSent) {
          const pipelineStatusService = getPipelineStatusService();
          console.log('sending emergency email');
          this.updateEmergencyEmailSent(true);
          await sendEmailsToManagers();
          await pipelineStatusService.markEnd();

          const {
            logPipelineError,
            logPipelineFinished,
          } = require('../utils/logging/loggerTemplates');

          const status = await pipelineStatusService.getStatus();
          const start = new Date(status.startTime).getTime();
          const end = new Date(status.endTime).getTime();

          const executionTime = ((end - start) / 1000).toFixed(2);
          logPipelineFinished(
            status.totalProcessed,
            status.pwaCount,
            status.noPwaCount,
            status.errorCount,
            status.savedPwaCount,
            executionTime
          );
          logPipelineError({
            name: 'no response',
            message: 'Crawler has no response for 10 minutes',
            stack: '',
          });
          logPipelineFinished(status.pwaCount, status.noPwa);
        }
      }
    } catch (error) {
      console.error('HealthCheck 실행 중 오류 발생:', error);
    }
  }

  startJob(minute = 5) {
    console.log('HealthCheck 스케쥴러 등록');
    this.lastLogTime = new Date();
    // this.job = schedule.scheduleJob(`*/3 * * * * *`, async () => { // test => 매 3초
    this.job = schedule.scheduleJob(`0 */${minute} * * * *`, async () => {
      console.log('HealthCheck:', new Date());
      await this.runTasks();
    });
    console.log(`HealthCheck 스케줄러 설정 완료 (${minute}분마다 실행)`);
  }

  stopJob() {
    if (this.job) {
      this.job.cancel();
      this.job = null;
      console.log('HealthCheck 스케줄러 중지');
    }
  }
}

module.exports = new HealthCheckScheduler();
