import tempfile
import os
import asyncio
import speech_recognition as sr
from pydub import AudioSegment
from fastapi import UploadFile
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize the Groq client with API key from .env
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

async def process_audio(file: UploadFile):
    contents = await file.read()
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_file:
        tmp_file.write(contents)
        tmp_filename = tmp_file.name

    def extract_text_from_audio(filename):
        # Use Groq to transcribe audio
        with open(filename, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                file=(filename, audio_file.read()),
                model="whisper-large-v3-turbo",
                response_format="json",
                language="en",
                temperature=0.0
            )
        return transcription.text

    loop = asyncio.get_event_loop()
    text = await loop.run_in_executor(None, extract_text_from_audio, tmp_filename)
    os.unlink(tmp_filename)
    return text