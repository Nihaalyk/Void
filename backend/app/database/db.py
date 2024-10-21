# app/database/db.py

import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

DB_URI = os.getenv("DB_URI")
db_pool = None

async def init_db():
    global db_pool
    db_pool = await asyncpg.create_pool(DB_URI)

async def close_db():
    await db_pool.close()

# Ensure fetch_extracted_data is defined
async def fetch_extracted_data(user_id: str):
    async with db_pool.acquire() as connection:
        try:
            rows = await connection.fetch(
                '''
                SELECT content
                FROM extracted_data
                WHERE user_id = $1
                ORDER BY created_at DESC;
                ''',
                user_id
            )
            return [row['content'] for row in rows]
        except Exception as e:
            print(f"Error fetching extracted data for user_id {user_id}: {e}")
            return []
        
async def store_summary_in_db(user_id: str, raw_text: str, summary: dict):
    async with db_pool.acquire() as connection:
        try:
            timestamp = datetime.now()
            summary_json = json.dumps(summary)
            await connection.execute(
                '''
                INSERT INTO graphs (raw_text, graph, created_at)
                VALUES ($1, $2, $3);
                ''',
                raw_text, summary_json, timestamp
            )
            print(f"Summary stored successfully for user_id {user_id}.")
        except Exception as e:
            print(f"Error storing summary for user_id {user_id}: {e}")
