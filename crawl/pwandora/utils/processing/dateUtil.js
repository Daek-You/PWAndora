const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const tz = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(tz);

const toKoreanISOString = (date = new Date()) => {
  return dayjs(date).tz('Asia/Seoul').format();
};

// 한국 시간 기준 오늘 날짜 (YYYYMMDD)
const getKoreanDateString = () => {
  return dayjs().tz('Asia/Seoul').format('YYYYMMDD');
};

// 오늘 날짜의 시작 시각 (00:00:00)
const getKoreanStartOfToday = () => {
  return dayjs().tz('Asia/Seoul').startOf('day').toDate();
};

const getKoreanHourString = () => {
  return dayjs().tz('Asia/Seoul').format('YYYYMMDDHH');
};

module.exports = {
  toKoreanISOString,
  getKoreanDateString,
  getKoreanHourString,
  getKoreanStartOfToday,
};
