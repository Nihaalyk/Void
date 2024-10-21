# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.knowledge_graph_router import router as knowledge_graph_router
from app.database.db import init_db, close_db
from app.utils.logger import get_logger

# Initialize logger
logger = get_logger("main")

app = FastAPI(
    title="Knowledge Graph API",
    description="An API to generate knowledge graphs and fetch related study materials.",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],  # Adjust as needed for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(knowledge_graph_router)

@app.on_event("startup")
async def startup_event():
    await init_db()
    logger.info("Application startup complete.")

@app.on_event("shutdown")
async def shutdown_event():
    await close_db()
    logger.info("Application shutdown complete.")

@app.get("/")
async def root():
    return {"message": "Welcome to the Knowledge Graph API!"}
