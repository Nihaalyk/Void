# app/services/image_processor.py
import pytesseract
from PIL import Image
import io

async def process_image(file_content: bytes) -> str:
    image = Image.open(io.BytesIO(file_content))
    text = pytesseract.image_to_string(image)
    return text
