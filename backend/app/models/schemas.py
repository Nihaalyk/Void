# app/models/schemas.py

from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any

class ChatRequest(BaseModel):
    user_id: str
    prompt: str

class ChatResponse(BaseModel):
    role: str
    content: str

class KnowledgeGraphResponse(BaseModel):
    knowledge_graph: Dict[str, Any]
    generated_text: str  # Or List[str] if multiple texts
