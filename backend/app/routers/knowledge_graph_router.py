# app/routers/knowledge_graph_router.py

from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from app.utils.file_processor import process_file
from app.services.embedding_service import EmbeddingService
from app.models.schemas import KnowledgeGraphResponse
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/api/knowledge-graph", response_model=KnowledgeGraphResponse)
async def generate_knowledge_graph(file: UploadFile = File(...), user_id: str = Form(...)):
    try:
        # Process the uploaded file and extract text
        text = await process_file(file)
        if not text:
            raise HTTPException(status_code=400, detail="Failed to process the uploaded file.")

        # Initialize embedding service
        embedding_service = EmbeddingService()

        # Generate knowledge graph and fetch study materials
        result = await embedding_service.generate_and_store_embeddings(user_id)

        if not result:
            raise HTTPException(status_code=500, detail="Failed to generate knowledge graph and fetch study materials.")

        return KnowledgeGraphResponse(
            knowledge_graph=result["knowledge_graph"],
            generated_text=result["generated_text"]
        )

    except HTTPException as he:
        logger.error(f"HTTPException in generate_knowledge_graph: {he.detail}")
        raise he
    except Exception as e:
        logger.error(f"Error in generate_knowledge_graph: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
