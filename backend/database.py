# database.py

import asyncpg
import ollama
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
db_pool = None

async def init_db():
    global db_pool
    db_pool = await asyncpg.create_pool(DATABASE_URL)
    # Ensure the 'extracted_data' table exists
    async with db_pool.acquire() as connection:
        await connection.execute('''
        CREATE TABLE IF NOT EXISTS extracted_data (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        ''')

async def store_extracted_data(user_id, text):
    o = ollama.Client()
    embed = str(o.embed(model='nomic-embed-text', input=text))
    async with db_pool.acquire() as connection:
        await connection.execute(
            '''
            INSERT INTO extracted_data (user_id, content, embedding::vector(768))
            VALUES ($1, $2);
            ''',
            user_id, text, embed
        )

async def close_db():
    await db_pool.close()
