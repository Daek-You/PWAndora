from .base import db, BaseModel

class Category(BaseModel):
    __tablename__ = "category"
    
    name = db.Column(db.String(100), nullable=False)
    category_order = db.Column(db.Integer, nullable=False)
    category_image = db.Column(db.String(255))