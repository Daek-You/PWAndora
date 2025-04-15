from .base import db, PwaModel

class Content(PwaModel):
    __tablename__ = "content"
    
    language_id = db.Column(db.Integer, db.ForeignKey("language.id"), nullable=False)
    name = db.Column(db.String(255))
    summary = db.Column(db.String(255))
    description = db.Column(db.String(2000))