# app/services/embedding_service.py


import os
import json
import logging
from ollama import AsyncClient
from app.database.db import fetch_extracted_data, store_summary_in_db
from app.services.groq_service import GroqService
from typing import List
import asyncio

logger = logging.getLogger(__name__)

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost")
OLLAMA_PORT = os.getenv("OLLAMA_PORT", "11434")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "nomic-embed-text:latest")

class EmbeddingService:
    def __init__(self):
        self.groq_service = GroqService()
        self.ollama_client = AsyncClient(host=OLLAMA_HOST, port=int(OLLAMA_PORT))

    async def generate_and_store_embeddings(self, user_id: str):
        """
        Fetch extracted data, generate embeddings, and store summary in the database.
        """
        try:
            # Fetch extracted data for the user
            extracted_texts = await fetch_extracted_data(user_id)
            if not extracted_texts:
                logger.warning(f"No extracted data found for user_id {user_id}.")
                return

            combined_text = "\n".join(extracted_texts)

            # Generate knowledge graph
            knowledge_graph = self.groq_service.summarize_with_groq(combined_text)
            if not knowledge_graph:
                logger.error("Failed to generate knowledge graph.")
                return

            # Store knowledge graph in the database
            await store_summary_in_db(user_id, combined_text, knowledge_graph)

            # Extract keywords (implement your logic or use a library)
            keywords = self.extract_keywords(knowledge_graph, num_keywords=5)
            if not keywords:
                logger.warning("No keywords extracted from the knowledge graph.")
                return

            # Initialize study materials service
            from app.services.study_materials_service import StudyMaterialsService
            study_service = StudyMaterialsService()

            # Fetch study materials based on the top keyword
            top_keyword = keywords[0]
            study_materials = study_service.get_study_materials(top_keyword)

            # Generate a summary or additional text if needed
            generated_text = self.generate_text_based_on_keywords(study_materials)

            # Return both the knowledge graph and the generated text
            return {
                "knowledge_graph": knowledge_graph,
                "generated_text": generated_text
            }

        except Exception as e:
            logger.error(f"Error in generate_and_store_embeddings: {e}")
            return

    def extract_keywords(self, knowledge_graph: dict, num_keywords: int = 5) -> List[str]:
        """
        Extracts keywords from the knowledge graph. This can be implemented using various methods,
        such as traversing the graph or using NLP techniques.

        Args:
            knowledge_graph (dict): The hierarchical knowledge graph.
            num_keywords (int): Number of keywords to extract.

        Returns:
            List[str]: Extracted keywords.
        """
        # Placeholder implementation: Extract 'name' from each node
        keywords = []

        def traverse(node):
            if 'name' in node:
                keywords.append(node['name'])
            if 'children' in node:
                for child in node['children']:
                    traverse(child)

        traverse(knowledge_graph)

        # Remove duplicates and select top keywords
        unique_keywords = list(dict.fromkeys(keywords))
        return unique_keywords[:num_keywords]

    def generate_text_based_on_keywords(self, study_materials: dict) -> str:
        """
        Generates a summary or additional text based on the fetched study materials.

        Args:
            study_materials (dict): Study materials fetched from various sources.

        Returns:
            str: Generated text.
        """
        # Placeholder implementation
        return json.dumps(study_materials, indent=2)
