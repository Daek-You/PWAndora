from .base import db, BaseModel

class Permission(BaseModel):
    __tablename__ = "permission"
    
    name = db.Column(db.String(100), nullable=False)