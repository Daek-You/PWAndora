from .base import db, PwaModel

class Display(PwaModel):
    __tablename__ = "display"
    
    min_width = db.Column(db.Integer)
    max_width = db.Column(db.Integer)
    min_height = db.Column(db.Integer)
    max_height = db.Column(db.Integer)