from fastapi import FastAPI, File, UploadFile
from get_yt_vids import get_study_resources
import os
from langchain_text_splitters import RecursiveCharacterTextSplitter
from groq import AsyncGroq
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
import os
from pydantic import BaseModel
import asyncpg
from routers.file_upload_router import router as file_upload_router
from database import init_db, close_db
from processors.file_processor import process_file
from nibs.generate_knowledge_graph_groq import summarize_with_groq
from ollama import AsyncClient
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
ollama = AsyncClient(host='http://localhost:11434')

# uncoment this code if you want to use the splitter  

# splitter = RecursiveCharacterTextSplitter(
#         chunk_size=8000,
#         chunk_overlap=500
# )

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

        model = os.environ.get('EMBEDDING_MODEL')
        prompt_embedding = ollama.embed(
            model=model,
            input=request.prompt
        )
        print(prompt_embedding)

        context = await db.fetch('''
         SELECT content
         FROM extracted_data
         WHERE user_id = $1
         ORDER BY embedding::vector(768) <=> $2
         LIMIT 10;
        ''', request.user_id, str(prompt_embedding))

        system_prompt = f'''
        - You are an exceptionally intelligent, charismatic, and resourceful AI assistant. Your ability to understand and respond to user inquiries is unmatched. Provide insightful, engaging, and tailored responses that exceed expectations and leave a lasting impression. 
        - If the user's prompt is related to the CONTEXT provided, base your response on that context for maximum relevance and effectiveness
        ------CONTEXT------
        {'\n'.join([record['content'] for record in context])}
        -------------------
        '''


        messages = [
            {'role': 'system', 'content': system_prompt},
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
    return 'reads file'

@app.post('/api/knowledge-graph')
async def knowledge_graph(file: UploadFile = File(...)):
    try:
        text = await process_file(file)
        summary = summarize_with_groq(text)

        return summary
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

# Your API keys here
YOUTUBE_API_KEY = os.environ.get('YOUTUBE_API_KEY')
GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')
GOOGLE_CSE_ID = os.environ.get('GOOGLE_CSE_ID')

@app.post('/yt_links')
async def retrieve_yt_links(keyword: str):
    return get_study_resources(keyword, YOUTUBE_API_KEY, GOOGLE_API_KEY, GOOGLE_CSE_ID)
