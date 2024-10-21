# app/utils/file_processor.py

import aiofiles
import logging
from typing import Optional
import fitz  # PyMuPDF

logger = logging.getLogger(__name__)

async def process_file(file) -> Optional[str]:
    """
    Processes the uploaded file and extracts text.

    Args:
        file: UploadedFile instance.

    Returns:
        Extracted text as a string or None if failed.
    """
    try:
        if file.content_type == 'application/pdf':
            contents = await file.read()
            doc = fitz.open(stream=contents, filetype="pdf")
            text = ""
            for page in doc:
                text += page.get_text()
            return text
        elif file.content_type.startswith('text/'):
            contents = await file.read()
            return contents.decode('utf-8')
        else:
            logger.error("Unsupported file type.")
            return None
    except Exception as e:
        logger.error(f"Error processing file: {e}")
        return None
