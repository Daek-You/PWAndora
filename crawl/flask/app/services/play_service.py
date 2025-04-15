import time
from google_play_scraper import search, app
from app.model import Site, db
from app.daos import SiteDao
from data.search_term import search_terms
from flask_injector import inject
from app.utils.domain_util import extract_main_domain

class PlayService:
    @inject
    def __init__(self, site_dao : SiteDao):
        self.site_dao = site_dao
    
    def save_playstore_urls(self, lang='ko', country='kr', n_hits=50, batch_size=1000):
            
        # 1. 기존 URL들을 한 번에 조회하여 set으로 저장
        existing_urls = set(url[0] for url in Site.query.with_entities(Site.url).all())
        
        url_set = set()
        new_urls = []
        total_saved = 0
        
        try:
            for term in search_terms:
                time.sleep(1)
                result = search(term, lang=lang, country=country, n_hits=n_hits)

                for app_data in result:
                    app_url = self.get_app_url(app_data['appId'])
                    if app_url and app_url.get('website_url'):
                        url = app_url['website_url']
                        url_set.add(url)
                        
                        # 메모리에서 중복 체크
                        if url not in existing_urls:
                            new_urls.append(url)
                            
                            # 배치 크기에 도달하면 저장
                            if len(new_urls) >= batch_size:
                                sites = [Site(url=url, status='NONE') for url in new_urls]
                                self.site_dao.save_sites(sites)
                                
                                total_saved += len(new_urls)
                                new_urls = []  # 리스트 초기화
                                print(f"Progress: {total_saved} URLs saved")
            
            # 남은 URL 처리
            if new_urls:
                sites = [Site(url=url, status='NONE') for url in new_urls]
                self.site_dao.save_sites(sites)
                total_saved += len(new_urls)
            
            return total_saved, list(url_set)
        
        except Exception as e:
            db.session.rollback()
            raise e  # 예외를 호출자에게 전달

    def get_app_url(self, app_data, lang='ko', country='kr'):
        """개별 앱의 메인 도메인 URL을 가져오는 함수"""
        try:
            app_id = app_data['appId']
            app_details = app(
                app_id,
                lang=lang,
                country=country
            )

            if 'developerWebsite' in app_details:
                '''
                website_url -> developerWebsite로 연결되어있음..
                download_url 추가 필요
                file_size 추가 필요
                version 수정 필요
                '''
                # 메인 도메인 추출
                developer_website = app_details.get('developerWebsite', '')
                main_domain = extract_main_domain(developer_website) if developer_website else ''

                return {
                    'website_url': main_domain, # 메인 도메인을 website_url에 저장
                }
        except Exception as e:
            print(f"앱 {app_id} 처리 중 에러: {str(e)}")
        return None