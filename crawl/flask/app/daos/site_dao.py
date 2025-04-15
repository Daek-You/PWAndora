from app.model import db
from sqlalchemy.exc import SQLAlchemyError
from app.model.site import Site, StatusEnum

class SiteDao:
    def __init__(self):
        pass

    def save_site(self, site):
        """Site 객체를 데이터베이스에 저장하는 함수"""
        try:
            db.session.add(site)
            db.session.commit()
            return site
        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Site 저장 중 오류: {str(e)}")
            return None
    
    def save_sites(self, sites):
        """Site 객체 여러 개를 데이터베이스에 저장하는 함수"""
        try:
            db.session.bulk_save_objects(sites)
            db.session.commit()
            return sites
        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Site 저장 중 오류: {str(e)}")
            return None
    
    def get_uncensored_sites(self):
        """검열되지 않은 사이트 목록을 가져오는 함수"""
        return db.session.query(Site).filter(Site.status == StatusEnum.NONE).all()