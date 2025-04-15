from .base import db, PwaModel
from datetime import datetime

class Screenshot(PwaModel):
    __tablename__ = "screenshot"

    image_url = db.Column(db.String(255), nullable=False)
    screenshot_order = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    updated_at = db.Column(db.DateTime, onupdate=datetime.now)