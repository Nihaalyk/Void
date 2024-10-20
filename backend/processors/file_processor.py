# processors/file_processor.py

from fastapi import UploadFile, HTTPException
from .pdf_processor import process_pdf
from .image_processor import process_image
from .audio_processor import process_audio

async def process_file(file: UploadFile):
    content_type = file.content_type
    if content_type == 'application/pdf':
        text = await process_pdf(file)
    elif content_type.startswith('image/'):
        text = await process_image(file)
    elif content_type.startswith('audio/'):
        text = await process_audio(file)
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type")
    return text
