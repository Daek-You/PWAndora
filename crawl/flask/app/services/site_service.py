from app.model import Site, db
from app.daos import SiteDao
from flask_injector import inject

class SiteService:
    @inject
    def __init__(self, site_dao : SiteDao):
        """SiteService 초기화"""
        self.site_dao = site_dao
    
    def save_urls_from_csv(df):
        """CSV 파일에서 url 정보 가져와 저장"""
        # 1. 기존 URL들을 한 번에 조회하여 set으로 저장
        existing_urls = set(url[0] for url in 
            Site.query.with_entities(Site.url).all())
        
        # 2. CSV의 URL들을 리스트로 변환
        urls = df.iloc[:, 0].tolist()
        new_urls = []
        total_saved = 0
        batch_size = 1000  # 배치 크기 설정
        
        # 3. 메모리에서 중복 체크
        for url in urls:
            if url and isinstance(url, str):
                if not url.startswith(('http://', 'https://')):
                    url = f'https://{url}'
                if url not in existing_urls:
                    new_urls.append(url)
                    
                    # 배치 크기에 도달하면 저장
                    if len(new_urls) >= batch_size:
                        sites = [Site(url=url, status='NONE') for url in new_urls]
                        db.session.bulk_save_objects(sites)
                        db.session.commit()
                        
                        total_saved += len(new_urls)
                        new_urls = []
        
        # 남은 URL 처리
        if new_urls:
            sites = [Site(url=url, status='NONE') for url in new_urls]
            db.session.bulk_save_objects(sites)
            db.session.commit()
            total_saved += len(new_urls)
    
