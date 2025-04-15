class BuildWorkerManager {
  constructor(maxWorkers = process.env.BUILD_MAX_WORKER) {
    this.maxWorkers = maxWorkers;
    this.activeWorkers = 0;
    this.queue = [];
  }

  enqueue({ type, site, handler }) {
    return new Promise((resolve, reject) => {
      this.queue.push({ type, site, handler, resolve, reject });
      this.#processQueue();
    });
  }

  async #processQueue() {
    if (this.activeWorkers >= this.maxWorkers || this.queue.length === 0)
      return;

    const task = this.queue.shift();
    this.activeWorkers++;

    try {
      const result = await task.handler(task.site);
      task.resolve(result);
    } catch (error) {
      task.reject(error);
    } finally {
      this.activeWorkers--;
      this.#processQueue();
    }
  }
}

module.exports = new BuildWorkerManager();
