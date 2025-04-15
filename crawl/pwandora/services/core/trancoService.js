const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { models } = require('../../config/dbConfig');
const readline = require('readline');

class TrancoService {
  constructor(redisClient) {
    if (!TrancoService.instance) {
      this.redisClient = redisClient;
      this.baseUrl = 'https://tranco-list.eu/api';
      this.downloadDir = process.env.TRANCO_DOWNLOAD_PATH
      TrancoService.instance = this;
    }
    return TrancoService.instance;
  }

  static getInstance(redisClient) {
    if (!TrancoService.instance) {
      TrancoService.instance = new TrancoService(redisClient);
    }
    return TrancoService.instance;
  }

  async loadExistingUrlsToRedis() {
    try {
      const sites = await models.site.findAll({
        attributes: ['url'],
      });

      await this.redisClient.del('existing_urls');

      // 효율적: URL 배열을 만들어서 한 번에 처리
      const urls = sites.map((site) => site.url);

      // 1000개씩 배치로 처리
      const batchSize = 1000;
      for (let i = 0; i < urls.length; i += batchSize) {
        const batch = urls.slice(i, i + batchSize);
        await this.redisClient.sAdd('existing_urls', batch);
        console.log(`${i + batch.length}/${urls.length} URLs 처리 완료`);
      }

      console.log(`${sites.length}개의 URL을 Redis에 저장완료`);
    } catch (error) {
      console.error('기존 URL 로딩 실패:', error);
      throw error;
    }
  }

  async processNewUrls(filePath) {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });
    const newUrls = [];
    const urlsToCheck = [];
    
    // 1. 먼저 URL들을 수집
    for await (const line of rl) {
      const [_, domain] = line.split(',');
      if (!domain) continue;
      const url = `https://${domain}`;
      urlsToCheck.push(url);
      
      // 1000개씩 체크
      if (urlsToCheck.length >= 1000) {
        // 2. Redis에 한 번에 체크 (pipeline 대신 multi 사용)
        const multi = this.redisClient.multi();
        urlsToCheck.forEach(url => {
          multi.sIsMember('existing_urls', url);
        });
        
        const results = await multi.exec();
        
        // 3. 존재하지 않는 URL만 추가
        results.forEach((exists, index) => {
          if (!exists) {
            newUrls.push({
              url: urlsToCheck[index],
              status: 'NONE',
              created_at: new Date(),
              updated_at: new Date(),
            });
          }
        });
        
        // 4. DB에 저장
        if (newUrls.length > 0) {
          await this.saveBatchToDb(newUrls);
          newUrls.length = 0;
        }
        
        urlsToCheck.length = 0;
      }
    }
    
    // 남은 URL 처리
    if (urlsToCheck.length > 0) {
      const multi = this.redisClient.multi();
      urlsToCheck.forEach(url => {
        multi.sIsMember('existing_urls', url);
      });
      
      const results = await multi.exec();
      results.forEach((exists, index) => {
        if (!exists) {
          newUrls.push({
            url: urlsToCheck[index],
            status: 'NONE',
            created_at: new Date(),
            updated_at: new Date(),
          });
        }
      });
      
      if (newUrls.length > 0) {
        await this.saveBatchToDb(newUrls);
      }
    }
  }

  // DB에 새로운 URL들을 벌크 저장
  async saveBatchToDb(urls) {
    try {
      await models.site.bulkCreate(urls);
      console.log(`${urls.length}개의 새로운 URL 저장 완료`);
    } catch (error) {
      console.error('URL 저장 실패:', error);
      throw error;
    }
  }

  async syncLatestTrancoList() {
    try {
      // 기존 URL들을 Redis에 로드
      await this.loadExistingUrlsToRedis();
      // 다운로드 디렉토리 생성
      if (!fs.existsSync(this.downloadDir)) {
        fs.mkdirSync(this.downloadDir, { recursive: true });
      }

      // Tranco 리스트 다운로드
      const listsResponse = await axios.get(
        `${this.baseUrl}/lists/date/latest`
      );
      const listId = listsResponse.data.list_id;
      const downloadUrl = listsResponse.data.download;

      if (!downloadUrl) throw new Error('다운로드 URL을 찾을 수 없습니다.');

      const response = await axios.get(downloadUrl, { responseType: 'stream' });
      const fileName = `tranco_list_${listId}.csv`;
      const filePath = path.join(this.downloadDir, fileName);

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', async () => {
          console.log(`Tranco 리스트 다운로드 완료: ${fileName}`);
          // 다운로드 완료 후 새로운 URL 처리
          await this.processNewUrls(filePath);
          resolve(filePath);
        });
        writer.on('error', reject);
      });
    } catch (error) {
      console.error('Tranco 리스트 다운로드 중 오류:', error.message);
      throw error;
    }
  }

  async closeRedis() {
    if (this.redisClient) {
      await this.redisClient.quit();
    }
  }
}

module.exports = TrancoService;
