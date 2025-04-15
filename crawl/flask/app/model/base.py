from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import enum

db = SQLAlchemy()

class BaseModel(db.Model):
    __abstract__ = True
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    def to_dict(self):
        result = {}
        for column in self.__table__.columns:
            value = getattr(self, column.name)

            # Enum이면 문자열 값으로 변환
            if isinstance(value, enum.Enum):
                result[column.name] = value.value
            # datetime이면 ISO 포맷으로 변환
            elif isinstance(value, datetime.datetime):  
                result[column.name] = value.isoformat() if value else None
            else:
                result[column.name] = value

        return result

class PwaModel(BaseModel):
    __abstract__ = True
    
    pwa_id = db.Column(db.Integer, db.ForeignKey("pwa.id"), nullable=False)
