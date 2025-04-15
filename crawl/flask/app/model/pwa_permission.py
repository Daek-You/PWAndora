from .base import db, PwaModel
from datetime import datetime

class PWA_Permission(PwaModel):
    __tablename__ = "pwa_permission"
    
    permission_id = db.Column(db.Integer, db.ForeignKey("permission.id"), nullable=False)
    is_required = db.Column(db.Boolean, nullable=False, default=False)
    added_at = db.Column(db.DateTime, nullable=False, default=datetime.now)