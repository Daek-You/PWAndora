from .base import db, PwaModel

class PWA_Language(PwaModel):
    __tablename__ = "pwa_language"
    
    language_id = db.Column(db.Integer, db.ForeignKey("language.id"), nullable=False)