import uuid
from sqlalchemy import Column, String, Text, DateTime, Float, Boolean, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.db.postgres import Base

class Journal(Base):
    __tablename__ = "journals"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    sinta_level = Column(Integer, nullable=False)
    institution = Column(String, nullable=True)
    ojs_url = Column(String, nullable=False, unique=True)
    is_free = Column(Boolean, default=False)
    publication_fee = Column(Float, default=0.0)
    currency = Column(String, default="IDR")
    notes = Column(Text, nullable=True)
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
