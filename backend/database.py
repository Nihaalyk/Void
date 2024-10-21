# app/database/db.py

import asyncpg
import ollama
import os
from dotenv import load_dotenv
import logging

load_dotenv()

DB_URI = os.getenv("DB_URI")
db_pool = None
logger = logging.getLogger(__name__)

async def init_db():
    global db_pool
    try:
        db_pool = await asyncpg.create_pool(DB_URI)
        async with db_pool.acquire() as connection:
            # Ensure the 'users' table exists
            await connection.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY,
                name VARCHAR NOT NULL,
                email VARCHAR,  -- Make nullable if using Option 2
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            ''')

            # Ensure the 'extracted_data' table exists
            await connection.execute('''
            CREATE TABLE IF NOT EXISTS extracted_data (
                id SERIAL PRIMARY KEY,
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                content TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            ''')

            # Ensure the 'chat_history' table exists
            await connection.execute('''
            CREATE TABLE IF NOT EXISTS chat_history (
                id SERIAL PRIMARY KEY,
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                role VARCHAR NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            ''')

            # Ensure the 'graphs' table exists
            await connection.execute('''
            CREATE TABLE IF NOT EXISTS graphs (
                id SERIAL PRIMARY KEY,
                raw_text TEXT NOT NULL,
                graph JSONB NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            ''')

            # Create index for efficient chat history retrieval
            await connection.execute('''
            CREATE INDEX IF NOT EXISTS idx_chat_history_user_id_created_at ON chat_history (user_id, created_at DESC);
            ''')

            logger.info("Database tables ensured.")
    except Exception as e:
        logger.error(f"Error initializing the database: {e}")
        raise e

async def close_db():
    if db_pool:
        await db_pool.close()
        logger.info("Database connection pool closed.")

# CRUD Operations
async def store_user(user_id: str, name: str, email: str = None):
    async with db_pool.acquire() as connection:
        try:
            await connection.execute(
                '''
                INSERT INTO users (id, name, email)
                VALUES ($1, $2, $3)
                ON CONFLICT (id) DO NOTHING;
                ''',
                user_id, name, email
            )
            logger.info(f"User {user_id} stored successfully.")
        except Exception as e:
            logger.error(f"Error storing user {user_id}: {e}")
            raise e

async def store_extracted_data(user_id: str, text: str):
    async with db_pool.acquire() as connection:
        await connection.execute(
            '''
            INSERT INTO extracted_data (user_id, content)
            VALUES ($1, $2);
            ''',
            user_id, text
        )

async def close_db():
    await db_pool.close()
