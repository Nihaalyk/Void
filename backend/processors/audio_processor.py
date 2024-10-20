# processors/audio_processor.py

import tempfile
import os
import asyncio
import speech_recognition as sr
from pydub import AudioSegment
from fastapi import UploadFile

async def process_audio(file: UploadFile):
    contents = await file.read()
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_file:
        tmp_file.write(contents)
        tmp_filename = tmp_file.name

    def extract_text_from_audio(filename):
        recognizer = sr.Recognizer()
        # Convert audio to WAV format if necessary
        audio = AudioSegment.from_file(filename)
        audio.export(filename, format="wav")
        audio_file = sr.AudioFile(filename)
        with audio_file as source:
            audio_data = recognizer.record(source)
        text = recognizer.recognize_google(audio_data)
        return text

    loop = asyncio.get_event_loop()
    text = await loop.run_in_executor(None, extract_text_from_audio, tmp_filename)
    os.unlink(tmp_filename)
    return text
