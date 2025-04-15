from .base import db, BaseModel
from datetime import datetime

class Language(BaseModel):
    __tablename__ = "language"
    
    name = db.Column(db.String(255), nullable=False)
    code = db.Column(db.String(10), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    updated_at = db.Column(db.DateTime, onupdate=datetime.now)
    deleted_at = db.Column(db.DateTime)