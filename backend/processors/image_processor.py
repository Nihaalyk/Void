# processors/image_processor.py

import tempfile
import os
import asyncio
from PIL import Image
import pytesseract
from fastapi import UploadFile

async def process_image(file: UploadFile):
    contents = await file.read()
    with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tmp_file:
        tmp_file.write(contents)
        tmp_filename = tmp_file.name

    def extract_text_from_image(filename):
        image = Image.open(filename)
        text = pytesseract.image_to_string(image)
        return text

    loop = asyncio.get_event_loop()
    text = await loop.run_in_executor(None, extract_text_from_image, tmp_filename)
    os.unlink(tmp_filename)
    return text
