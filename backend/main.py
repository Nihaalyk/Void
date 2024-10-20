from fastapi import FastAPI
import os
from groq import AsyncGroq
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
import os
from pydantic import BaseModel
import asyncpg

load_dotenv()

app = FastAPI()

client = AsyncGroq(api_key=os.environ.get("GROQ_API_KEY"))

@app.on_event("startup")
async def on_startup():
    global db
    db = await asyncpg.connect(os.environ.get("DATABASE_URL"))

@app.get("/chat_history")
async def get_history(user_id: str):
    return await db.fetch(
        '''
        SELECT role, content
        FROM chat_history
        WHERE user_id = $1;
        ''', 
        user_id
    )

class ChatRequest(BaseModel):
    user_id: str
    prompt: str

@app.post("/chat")
async def root(request: ChatRequest):
    try:
        rows = await db.fetch(
            '''
            SELECT role, content
            FROM chat_history
            WHERE user_id = $1;
            ''', 
            request.user_id
        )

        await db.execute(
            '''
            INSERT INTO chat_history (user_id, role, content)
            VALUES ($1, 'user', $2);
            ''',
            request.user_id, request.prompt
        )

        messages = [
            *map(lambda row: {"role": row['role'], "content": row['content']}, rows),
            {'role': 'user', 'content': request.prompt}
        ]

        response = (
            await client.chat.completions.create(
                messages=messages,
                model="llama3-8b-8192",
            )
        ).choices[0].message.content


        await db.execute(
            '''
            INSERT INTO chat_history (user_id, role, content)
            VALUES ($1, 'assistant', $2);
            ''',
            request.user_id, response
        )

        return {"role": 'assistant', "content": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
