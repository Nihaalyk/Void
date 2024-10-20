# app/services/pdf_processor.py
import PyPDF2
from typing import str
import io

async def process_pdf(file_content: bytes) -> str:
    reader = PyPDF2.PdfReader(io.BytesIO(file_content))
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text
