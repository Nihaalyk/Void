# models.py

from pydantic import BaseModel

class UploadResponse(BaseModel):
    message: str
