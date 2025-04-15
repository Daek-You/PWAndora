from .base import db, PwaModel

class PWA_Category(PwaModel):
    __tablename__ = "pwa_category"
    
    category_id = db.Column(db.Integer, db.ForeignKey("category.id"), nullable=False)
