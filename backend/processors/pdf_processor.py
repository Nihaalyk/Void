# processors/pdf_processor.py

import tempfile
import os
import asyncio
from pdfminer.high_level import extract_text as extract_text_from_pdf
from fastapi import UploadFile

async def process_pdf(file: UploadFile):
    contents = await file.read()
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
        tmp_file.write(contents)
        tmp_filename = tmp_file.name

    loop = asyncio.get_event_loop()
    text = await loop.run_in_executor(None, extract_text_from_pdf, tmp_filename)
    os.unlink(tmp_filename)
    return text
