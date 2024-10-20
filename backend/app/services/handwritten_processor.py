# app/services/handwritten_processor.py
from .image_processor import process_image

async def process_handwritten(file_content: bytes) -> str:
    # You can add specialized processing for handwritten notes here
    text = await process_image(file_content)
    return text
