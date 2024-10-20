# main.py
from fastapi import FastAPI
import os
from groq import Groq
from dotenv import load_dotenv
from app.routers import file_handler
from app.database import engine
from app import models
import asyncio

load_dotenv()

app = FastAPI()

# Initialize Groq client
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

@app.on_event("startup")
async def startup_event():
    # Create database tables
    async with engine.begin() as conn:
        await conn.run_sync(models.Base.metadata.create_all)

# Include the file handler router
app.include_router(file_handler.router)

@app.get("/chat")
async def root():
    return client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": "Explain the importance of fast language models",
            }
        ],
        model="llama3-8b-8192",
    )
