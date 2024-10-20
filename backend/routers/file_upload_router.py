# routers/file_upload_router.py

from fastapi import APIRouter, File, UploadFile, HTTPException
from processors import process_file, clean_and_process_text
from database import store_extracted_data

router = APIRouter()

@router.post("/uploadfile/")
async def upload_file(user_id: str, file: UploadFile = File(...)):
    """
    Endpoint to upload a file and process it based on its type.
    """
    try:
        text = await process_file(file)
        processed_text = await clean_and_process_text(text)
        # Store in database
        await store_extracted_data(user_id, processed_text)
        return {"message": "File processed and data stored successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
