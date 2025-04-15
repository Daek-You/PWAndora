from .base import db, PwaModel

class PWA_Review(PwaModel):
    __tablename__ = "pwa_review"
    
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)