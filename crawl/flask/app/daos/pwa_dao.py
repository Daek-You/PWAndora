from app.model import db
from sqlalchemy.exc import SQLAlchemyError

class PwaDao:
    def __init__(self):
        pass

    def save_pwa(self, pwa):
        """PWA 객체를 데이터베이스에 저장하는 함수"""
        try:
            db.session.add(pwa)
            db.session.commit()
            print(f"{pwa.name} PWA 정보가 데이터베이스에 저장되었습니다.")
            return pwa
        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"PWA 저장 중 오류: {str(e)}")
            return None