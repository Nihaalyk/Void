# app/schemas.py
from pydantic import BaseModel
from enum import Enum
from datetime import datetime

class FileType(str, Enum):
    PDF = "pdf"
    IMAGE = "image"
    AUDIO = "audio"
    HANDWRITTEN = "handwritten"

class ExtractedDataSchema(BaseModel):
    id: int
    file_type: FileType
    file_name: str
    extracted_content: str
    created_at: datetime

    class Config:
        orm_mode = True
