from flask import Flask
from app.config.config import Config
from app.model import db
from flask_restx import Api
from app.apis.api import Swagger
from flask_injector import FlaskInjector
from injector import Binder, singleton

def configure(binder: Binder) -> Binder:
    from app.services import PlayService, SiteService, PWAService, TizenService
    binder.bind(PlayService, to=PlayService, scope=singleton)
    binder.bind(SiteService, to=SiteService, scope=singleton)
    binder.bind(PWAService, to=PWAService, scope=singleton)
    binder.bind(TizenService, to=TizenService, scope=singleton)

def create_app():
    app = Flask(__name__)
    
    # 설정 로드
    app.config.from_object(Config)

    
    # 데이터베이스 초기화
    db.init_app(app)
    
    # API 네임스페이스 등록
    api = Api(
        app,
        version='1.0',
        title='PWA Crawler API',
        description='PWA 정보를 크롤링하는 API',
        doc='/docs'
    )
    
    api.add_namespace(Swagger.api_ns) 
    
    # DI
    FlaskInjector(app=app, modules=[configure])
    
    return app 