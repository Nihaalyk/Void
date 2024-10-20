# app/models.py
from sqlalchemy import Column, Integer, String, Text, Enum, DateTime
from sqlalchemy.ext.declarative import declarative_base
import enum
from datetime import datetime

Base = declarative_base()

class FileType(enum.Enum):
    PDF = "pdf"
    IMAGE = "image"
    AUDIO = "audio"
    HANDWRITTEN = "handwritten"

class ExtractedData(Base):
    __tablename__ = "extracted_data"

    id = Column(Integer, primary_key=True, index=True)
    file_type = Column(Enum(FileType), nullable=False)
    file_name = Column(String, nullable=False)
    extracted_content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
