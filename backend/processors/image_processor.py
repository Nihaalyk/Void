import tempfile
import os
import asyncio
from PIL import Image, ImageEnhance, ImageFilter
import pytesseract
from fastapi import UploadFile

async def process_image(file: UploadFile):
    contents = await file.read()
    with tempfile.NamedTemporaryFile(delete=False, suffix=".img") as tmp_file:
        tmp_file.write(contents)
        tmp_filename = tmp_file.name

    def extract_text_from_image(filename):
        # Open the image with Pillow and enhance for better OCR, especially for handwritten text
        with Image.open(filename) as image:
            # Convert image to grayscale
            image = image.convert('L')
            # Apply filters to enhance the quality of the image
            image = image.filter(ImageFilter.MedianFilter())
            enhancer = ImageEnhance.Contrast(image)
            image = enhancer.enhance(2)
            # Perform OCR using Tesseract
            custom_config = r'--oem 1 --psm 11'
            text = pytesseract.image_to_string(image, config=custom_config)
        return text

    loop = asyncio.get_event_loop()
    text = await loop.run_in_executor(None, extract_text_from_image, tmp_filename)
    os.unlink(tmp_filename)
    return text
