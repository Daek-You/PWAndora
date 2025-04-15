from flask_injector import inject
from app.daos import PwaDao, SiteDao
# from app.services import TizenService
from concurrent.futures import ThreadPoolExecutor, as_completed
from app.consts.THREAD import THREAD_AMOUNT
from app.scrapers.info_scraper import PWAScraper, ScrapResult
from app.model import PWA
from app.model.site import StatusEnum

class PWAService:
    @inject
    def __init__(self, pwa_dao: PwaDao, site_dao: SiteDao):
    # def __init__(self, pwa_dao: PwaDao, site_dao: SiteDao, tizen_service: TizenService):
        self.pwa_dao = pwa_dao
        self.site_dao = site_dao
        # self.tizen_service = tizen_service
        self.thread_pool = ThreadPoolExecutor(max_workers=THREAD_AMOUNT)

    def scrape_site(self, url): # single thread
        """각 사이트에 대해 개별적으로 실행될 스크래핑 함수"""
        scraper = PWAScraper()
        res:ScrapResult = scraper.scrape(url)
        if(res.isPWA):
            return res.app.to_dict()
        else:
            return None
    
    def scrape_sites(self, sites):
        # 2~3번 모듈
        results = []
        for site in sites:
            result = self.scrape_site(site)
            if(result):
                results.append(result)

        return results

    def package_apps(self, app_infos:list[dict]):
        # 4번 모듈
        results = []
        for app_info in app_infos:
            res = self.tizen_service.package(app_info)
            results.append(res)
        return results
    
    def run_pipeline(self): # 검수되지 않은 URL에 대해 PWA 정보 수집 및 DB 저장
        """검수 파이프라인 실행"""
        # 1. 검수되지 않은 사이트들 가져오기
        uncensored_sites = self.site_dao.get_uncensored_sites()

        # uncensored_sites = [
        #     'https://instagram.com',
        #     'https://facebook.com',
        #     'https://x.com',
        #     'https://youtube.com'
        # ]

        total_sites = len(uncensored_sites)
        total_saved = 0

        # 사이트 URL 리스트 추출
        site_urls = [site.url for site in uncensored_sites]
        
        # 2~3번 모듈 (스크래핑)
        app_infos = self.scrape_sites(site_urls)
        
        # 4번 모듈 (패키징)
        results = self.package_apps(app_infos)
        
        # 결과 반영
        for site in uncensored_sites:
            try:
                # URL에 해당하는 app_info 찾기
                matching_app = next((app for app in app_infos if app.get('website_url') == site.url), None)
                
                if matching_app:
                    # PWA인 경우
                    pwa = PWA(
                        app_id=matching_app.get('name'),
                        website_url=site.url,
                        icon_image=matching_app.get('icons', [])[0] if matching_app.get('icons') else None,
                        download_url=next((r.get('download_url') for r in results if r and r.get('download_url')), None),
                        file_size=next((r.get('file_size') for r in results if r and r.get('file_size')), None)
                    )
                    
                    saved_pwa = self.pwa_dao.save_pwa(pwa)
                    if saved_pwa:
                        site.status = StatusEnum.CONFIRM
                        site.pwa_id = saved_pwa.id
                        self.site_dao.save_site(site)
                        total_saved += 1
                else:
                    # PWA가 아닌 경우
                    site.status = StatusEnum.NO_PWA
                    self.site_dao.save_site(site)
                    
            except Exception as e:
                print(f"Error processing {site.url}: {str(e)}")
                continue
        
        return total_saved, total_sites
    