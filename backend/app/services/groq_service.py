# app/services/groq_service.py

from typing import Optional  # Import Optional for type hints
from groq import Groq
import os
import json
import logging

logger = logging.getLogger(__name__)

class GroqService:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    def summarize_with_groq(self, text: str) -> Optional[dict]:
        """
        Summarizes the text using the Groq API and returns a structured knowledge graph.
        """
        system_prompt = (
            "You are an assistant that structures data into a hierarchical multilevel knowledge graph in JSON format. "
            "The output should be a JSON object following this format: "
            "{ \"name\": \"Root\", \"children\": [ { \"name\": \"Child 1\", \"children\": [ { \"name\": \"Grandchild 1\" }, { \"name\": \"Grandchild 2\" } ] }, { \"name\": \"Child 2\", \"children\": [ { \"name\": \"Grandchild 3\" }, { \"name\": \"Grandchild 4\" } ] } ] }. "
            "Ensure that only 'name' and 'children' keys are used. "
            "Do not include any explanations, code snippets, or text outside the JSON. Provide only the JSON output."
        )

        try:
            completion = self.client.chat.completions.create(
                model=os.getenv("GROQ_MODEL"),
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": text}
                ],
                temperature=1,
                max_tokens=1024,
                top_p=1,
                stream=False,
                stop=None,
            )

            summarized_output = completion.choices[0].message.content.strip()
            return json.loads(summarized_output)
        except Exception as e:
            logger.error(f"Error in Groq summarization: {e}")
            return None
