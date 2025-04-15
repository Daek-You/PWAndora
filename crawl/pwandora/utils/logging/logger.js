const pino = require('pino');
const fs = require('fs');
const path = require('path');
const tls = require('tls');
const dayjs = require('dayjs');
const { multistream } = require('pino-multi-stream');

const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

const LOGSTASH_HOST = process.env.LOGSTASH_HOST;
const LOGSTASH_PORT = Number(process.env.LOGSTASH_PORT);
const SSL_ENABLED = true;
const LOG_RETENTION_DAYS = 7;

let currentHour = dayjs().format('YYYYMMDDHH');
let logger = null;

const createLogstashStream = () => {
  const socket = tls.connect(
    {
      host: LOGSTASH_HOST,
      port: LOGSTASH_PORT,
      rejectUnauthorized: false,
    },
    () => {
      console.log(`[${new Date().toISOString()}] Logstash SSL connected`);
    }
  );

  socket.on('error', (err) => {
    console.error(
      `[${new Date().toISOString()}] Logstash SSL error:`,
      err.message
    );
  });

  return socket;
};

const updateStreams = () => {
  const hour = dayjs().format('YYYYMMDDHH');

  if (currentHour !== hour || !logger) {
    currentHour = hour;

    const logPath = path.join(logsDir, `pipeline-${hour}.log`);
    const fileStream = fs.createWriteStream(logPath, { flags: 'a' });

    const logstashStream = SSL_ENABLED ? createLogstashStream() : null;

    const streams = logstashStream
      ? multistream([{ stream: fileStream }, { stream: logstashStream }])
      : multistream([{ stream: fileStream }]);

    logger = pino(
      {
        level: process.env.LOG_LEVEL || 'trace',
        base: null,
        timestamp: pino.stdTimeFunctions.isoTime,
      },
      streams
    );
  }
};

// 오래된 로그 파일 삭제 (7일 이상 지난 파일 삭제)
const cleanupOldLogs = () => {
  const files = fs.readdirSync(logsDir);

  files.forEach((file) => {
    const match = file.match(/pipeline-(\d{10})\.log$/);
    if (match) {
      const fileTime = dayjs(match[1], 'YYYYMMDDHH');
      const now = dayjs();
      if (now.diff(fileTime, 'day') >= LOG_RETENTION_DAYS) {
        fs.unlinkSync(path.join(logsDir, file));
        console.log(`[${now.format()}] Deleted old log file: ${file}`);
      }
    }
  });
};

updateStreams();
setInterval(() => {
  updateStreams();
  cleanupOldLogs();
}, 60 * 1000);

cleanupOldLogs();

module.exports = new Proxy(
  {},
  {
    get(_, method) {
      updateStreams();
      if (typeof logger[method] === 'function') {
        return logger[method].bind(logger);
      }
      return logger[method];
    },
  }
);
