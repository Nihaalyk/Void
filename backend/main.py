from fastapi import FastAPI, File, UploadFile
import os
from groq import AsyncGroq
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
import os
from pydantic import BaseModel
import asyncpg
from routers.file_upload_router import router as file_upload_router
from database import init_db, close_db
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(file_upload_router)

client = AsyncGroq(api_key=os.environ.get("GROQ_API_KEY"))

@app.on_event("startup")
async def startup_event():
    await init_db()
    global db
    db = await asyncpg.connect(os.environ.get("DATABASE_URL"))
    # Existing startup code...

@app.on_event("shutdown")
async def shutdown_event():
    await close_db()
    # Existing shutdown code...

@app.get("/api/chat_history")
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

@app.post("/api/chat")
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

@app.post('/api/test')
async def test_route(file: UploadFile = File(...)):
    print(file)
    return 'reads file'
