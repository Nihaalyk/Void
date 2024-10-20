from fastapi import FastAPI
import os
from groq import Groq
from dotenv import load_dotenv
from app import models
from fastapi import FastAPI, HTTPException
import os
from groq import Groq
from dotenv import load_dotenv
from pydantic import BaseModel
import asyncpg

load_dotenv()

app = FastAPI()

# Initialize Groq client
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

@app.on_event("startup")
async def on_startup():
    global db
    db = await asyncpg.connect(os.environ.get("DATABASE_URL"))

class ChatRequest(BaseModel):
    content: str

@app.get("/chat")
async def root(request: ChatRequest):
    try:
        response = client.chat.completions.create(
            messages=[
                {"role": "user", "content": request.content}
            ],
            model="llama3-8b-8192",
        )

        chat_output = response["choices"][0]["message"]["content"]

        return {"response": chat_output}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.get('/db_test')
async def query():
    return await db.fetchval('SELECT * FROM users')
