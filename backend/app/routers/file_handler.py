# app/routers/file_handler.py
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from typing import List
from .. import schemas, crud, models
from ..database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from ..services import (
    pdf_processor,
    image_processor,
    audio_processor,
    handwritten_processor
)
import os

router = APIRouter()

@router.post("/upload", response_model=List[schemas.ExtractedDataSchema])
async def upload_files(files: List[UploadFile] = File(...), db: AsyncSession = Depends(get_db)):
    extracted_data_list = []

    for file in files:
        content = await file.read()
        file_type = determine_file_type(file.content_type, file.filename)

        if file_type == models.FileType.PDF:
            extracted_content = await pdf_processor.process_pdf(content)
        elif file_type == models.FileType.IMAGE:
            extracted_content = await image_processor.process_image(content)
        elif file_type == models.FileType.AUDIO:
            extracted_content = await audio_processor.process_audio(content)
        elif file_type == models.FileType.HANDWRITTEN:
            extracted_content = await handwritten_processor.process_handwritten(content)
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}")

        # Clean and process the extracted content as needed
        cleaned_content = clean_extracted_content(extracted_content)

        data_schema = schemas.ExtractedDataSchema(
            file_type=file_type,
            file_name=file.filename,
            extracted_content=cleaned_content
        )
        db_data = await crud.create_extracted_data(db, data_schema)
        extracted_data_list.append(db_data)

    return extracted_data_list

def determine_file_type(content_type: str, filename: str) -> models.FileType:
    if content_type == "application/pdf" or filename.lower().endswith(".pdf"):
        return models.FileType.PDF
    elif content_type.startswith("image/"):
        return models.FileType.IMAGE
    elif content_type.startswith("audio/"):
        return models.FileType.AUDIO
    elif content_type.startswith("application/vnd.ms-fontobject") or filename.lower().endswith((".png", ".jpg", ".jpeg")):
        # Adjust based on how handwritten notes are uploaded
        return models.FileType.HANDWRITTEN
    else:
        return None

def clean_extracted_content(content: str) -> str:
    # Implement your cleaning logic here
    # For example, remove extra spaces, special characters, etc.
    import re
    cleaned = re.sub(r'\s+', ' ', content).strip()
    return cleaned
