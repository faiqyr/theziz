import uuid
from sqlalchemy import Column, String, Text, DateTime, Float, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.db.postgres import Base

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    filename = Column(String, nullable=False)
    status = Column(String, default="processing")
    summary = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Conversation(Base):
    __tablename__ = "conversations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # Storing document ids as a JSON array or a relationship table
    document_ids = Column(JSONB, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("conversations.id"), nullable=False)
    role = Column(String, nullable=False) # user or assistant
    content = Column(Text, nullable=False)
    citations = Column(JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Evaluation(Base):
    __tablename__ = "evaluations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    message_id = Column(UUID(as_uuid=True), ForeignKey("messages.id"), nullable=False)
    model_name = Column(String, nullable=False)
    faithfulness = Column(Float, nullable=True)
    context_precision = Column(Float, nullable=True)
    answer_relevancy = Column(Float, nullable=True)
    latency_ms = Column(Integer, nullable=True)
