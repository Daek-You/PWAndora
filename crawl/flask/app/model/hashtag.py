from .base import db, BaseModel

class Hashtag(BaseModel):
    __tablename__ = "hashtag"
    
    name = db.Column(db.String(100), nullable=False)