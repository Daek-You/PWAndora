from flask_restx import Resource
from flask import request
import pandas as pd
from flask_injector import inject
from app.services import PlayService, SiteService, PWAService
from app.model import db
from app.apis.swagger import Swagger

@Swagger.api_ns.route('/site/google-play')
class SiteGooglePlayScraperRegister(Resource):
    @inject
    def __init__(self, play_service: PlayService, **kwargs):
        super().__init__()
        self.play_service = play_service
    
    @Swagger.api_ns.expect(Swagger.query_params_model)
    def post(self):
        """구글 플레이스토어에서 앱의 사이트 주소를 수집하고 DB에 저장합니다."""
        lang = Swagger.api_ns.payload.get('lang', 'ko')
        country = Swagger.api_ns.payload.get('country', 'kr')
        n_hits = Swagger.api_ns.payload.get('n_hits', 50)
        
        try:
            # 구글 플레이에서 URL 수집 및 저장
            total_saved, url_list = self.play_service.save_playstore_urls(lang=lang, country=country, n_hits=n_hits)
            
            return {
                'status': 'success',
                'message': f'총 {len(url_list)}개의 URL 중 {total_saved}개가 새로 저장되었습니다.',
                'data': url_list
            }
        
        except Exception as e:
            db.session.rollback()
            Swagger.api_ns.abort(500, e.__str__())

@Swagger.api_ns.route('/site/csv')
class SiteCsvRegister(Resource):
    @inject
    def __init__(self, site_service: SiteService, **kwargs):
        super().__init__()
        self.site_service = site_service
    
    @Swagger.api_ns.expect(Swagger.file_upload_model)
    @Swagger.api_ns.doc(consumes=['multipart/form-data'])  # 파일 업로드를 위한 content-type 지정
    def post(self):
        """URL을 모은 CSV 파일의 데이터를 DB에 저장합니다."""
        try:
            # 파일이 요청에 포함되어 있는지 확인
            if 'file' not in request.files:
                return {'status': 'error', 'message': '파일이 없습니다.'}, 400
            
            file = request.files['file']
            if file.filename == '':
                return {'status': 'error', 'message': '선택된 파일이 없습니다.'}, 400
            
            # CSV 파일 읽기
            df = pd.read_csv(file)
            
            # 서비스로 URL 저장 처리 위임
            total_saved = self.site_service.save_urls_from_csv(df)
            
            return {
                'status': 'success',
                'message': f'{total_saved}개의 URL이 저장되었습니다.',
                'total_urls': len(df)
            }
        
        except Exception as e:
            db.session.rollback()
            return {'status': 'error', 'message': str(e)}, 500

@Swagger.api_ns.route('/pwa')
class PwaRegister(Resource):
    @inject
    def __init__(self, pwa_service: PWAService, **kwargs):
        super().__init__()
        self.pwa_service = pwa_service
        print(kwargs)

    def get(self):
        """검수하지 않은 URL에 대하여 PWA 정보를 수집하고 DB에 저장합니다."""
        
        print('PWA 정보 수집 시작')
        total_saved, total_sites = self.pwa_service.run_pipeline()
        # total_saved = 0

        return {
            'status': 'success',
            'message': f'총 {total_saved}개의 PWA가 등록되었습니다.',
            'data': {
                'total_sites': total_sites,          # 총 검수 사이트 수
                'pwa_sites': total_saved,           # PWA로 확인된 사이트 수
                'non_pwa_sites': total_sites - total_saved  # PWA가 아닌 사이트 수
            }
        }