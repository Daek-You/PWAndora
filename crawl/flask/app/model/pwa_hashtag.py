from .base import db, PwaModel

class PWA_Hashtag(PwaModel):
    __tablename__ = "pwa_hashtag"
    
    hashtag_id = db.Column(db.Integer, db.ForeignKey("hashtag.id"), nullable=False)
