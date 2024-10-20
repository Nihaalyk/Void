import os
from pydantic import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY")

settings = Settings()
