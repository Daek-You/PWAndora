class RedisBaseService {
  constructor(redis, prefix = '', defaultTTL = 60 * 60 * 24) {
    this.redis = redis;
    this.prefix = prefix;
    this.defaultTTL = defaultTTL;
  }

  // Redis 키 생성: prefix + key
  _key(key) {
    return `${this.prefix}${key}`;
  }

  // 객체 전체 저장
  async setHash(key, data, ttl = this.defaultTTL) {
    const fullKey = this._key(key);
    const flat = {};
    for (const [k, v] of Object.entries(data)) {
      flat[k] = JSON.stringify(v);
    }
    await this.redis.hSet(fullKey, flat);
    if (ttl > 0) await this.redis.expire(fullKey, ttl);
  }

  // JSON 파싱된 객체 반환
  async getHash(key) {
    const raw = await this.redis.hGetAll(this._key(key));
    const parsed = {};
    for (const k in raw) {
      try {
        parsed[k] = JSON.parse(raw[k]);
      } catch {
        parsed[k] = raw[k];
      }
    }
    return parsed;
  }

  // 전체 객체 반환
  async getAll(key) {
    const raw = await this.redis.hGetAll(this._key(key));
    const parsed = {};
    for (const k in raw) {
      try {
        parsed[k] = JSON.parse(raw[k]);
      } catch {
        parsed[k] = raw[k];
      }
    }
    return parsed;
  }
  

  // 개별 필드 저장
  async setField(key, field, value, ttl = this.defaultTTL) {
    const fullKey = this._key(key);
    await this.redis.hSet(fullKey, field, JSON.stringify(value));
    if (ttl > 0) await this.redis.expire(fullKey, ttl);
  }

  // 개별 필드 조회
  async getField(key, field) {
    const value = await this.redis.hGet(this._key(key), field);
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  // 카운터 증가
  async incr(key, field, amount = 1) {
    return this.redis.hIncrBy(this._key(key), field, amount);
  }

  // 키 삭제
  async del(key) {
    await this.redis.del(this._key(key));
  }
}

module.exports = RedisBaseService;
