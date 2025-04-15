from flask_restx import Namespace, fields

class Swagger:
    api_ns = Namespace('api', description='크롤러 관련 API')

    # 쿼리 파라미터 정의
    query_params_model = api_ns.model('QueryParams', {
        'lang': fields.String(default='ko', description="언어 설정 (기본값: 'ko')."),
        'country': fields.String(default='kr', description="국가 설정 (기본값: 'kr')."),
        'n_hits': fields.Integer(default=50, description="검색 결과 개수 (기본값: 50).")
    })

    # 파일 업로드 모델 정의
    file_upload_model = api_ns.model('FileUpload', {
        'file': fields.Raw(description='URL이 포함된 CSV 파일', required=True)
    })