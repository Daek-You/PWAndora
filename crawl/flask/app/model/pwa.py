from .base import db, BaseModel
from datetime import datetime
import enum

class AcceptanceStatusEnum(enum.Enum):
    NONE = "NONE"
    PENDING = "PENDING"
    ACCEPTED = "ACCEPTED"

class PWA(BaseModel):
    __tablename__ = "pwa"

    app_id = db.Column(db.String(255), nullable=False, unique=True)
    icon_image = db.Column(db.String(255))
    website_url = db.Column(db.String(255), nullable=False)  # 메인 페이지
    download_url = db.Column(db.String(255), nullable=False)  # 패키지 다운로드 링크
    avg_score = db.Column(db.Float)
    download_count = db.Column(db.Integer, nullable=False, default=0)
    file_size = db.Column(db.String(31))
    version = db.Column(db.String(31))
    company = db.Column(db.String(255))
    developer_site = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    updated_at = db.Column(db.DateTime, onupdate=datetime.now)
    blocked_at = db.Column(db.DateTime)
    acceptance_status = db.Column(db.Enum(AcceptanceStatusEnum), default=AcceptanceStatusEnum.NONE)
    accepted_at = db.Column(db.DateTime)