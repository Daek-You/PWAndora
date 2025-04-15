from .base import db, BaseModel
from datetime import datetime
import enum

class StatusEnum(enum.Enum):
    NONE = "NONE"
    CONFIRM = "CONFIRM"
    NO_PWA = "NO_PWA"

class Site(BaseModel):
    __tablename__ = "site"
    
    pwa_id = db.Column(db.Integer, db.ForeignKey("pwa.id"))
    url = db.Column(db.String(255), nullable=False, unique=True)
    status = db.Column(db.Enum(StatusEnum), nullable=False, default=StatusEnum.NONE)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    updated_at = db.Column(db.DateTime, onupdate=datetime.now)