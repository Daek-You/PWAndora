const { chromium } = require('playwright');

class WorkerManager {
  constructor() {
    if (!WorkerManager.instance) {
      this.workers = [];
      this.available = [];
      this.waitQueue = [];
      WorkerManager.instance = this;
    }
    return WorkerManager.instance;
  }

  static getInstance() {
    if (!WorkerManager.instance) {
      WorkerManager.instance = new WorkerManager();
    }
    return WorkerManager.instance;
  }

  async initializeWorkers(workerCount) {
    for (let i = 0; i < workerCount; i++) {
      const browser = await chromium.launch();
      this.workers.push(browser);
      this.available.push(browser);
    }
    console.log(`${workerCount}개의 크로미움 워커 생성 완료`);
  }

  async getWorker() {
    if (this.available.length > 0) {
      const worker = this.available.pop();
      return worker;
    }

    return new Promise((resolve) => {
      this.waitQueue.push((worker) => {
        resolve(worker);
      });
    });
  }

  async releaseWorker(worker) {
    if (this.waitQueue.length > 0) {
      const next = this.waitQueue.shift();
      try {
        next(worker);
      } catch (e) {
        console.error('워커 할당 중 에러:', e.message);
        this.available.push(worker);
      }
    } else {
      this.available.push(worker);
    }
  }

  async closeAllWorkers() {
    for (const worker of this.workers) {
      try {
        await worker.close();
      } catch (err) {
        console.error('브라우저 종료 실패:', err.message);
      }
    }
    this.workers = [];
    this.available = [];
    this.waitQueue = [];
    console.log(`모든 크로미움 워커 종료`);
  }
}

module.exports = WorkerManager.getInstance();
