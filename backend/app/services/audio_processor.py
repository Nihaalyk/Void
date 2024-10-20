# app/services/audio_processor.py
import speech_recognition as sr
from pydub import AudioSegment
import io

async def process_audio(file_content: bytes) -> str:
    # Convert bytes to AudioSegment
    audio = AudioSegment.from_file(io.BytesIO(file_content))
    # Export to WAV format in-memory
    wav_io = io.BytesIO()
    audio.export(wav_io, format="wav")
    wav_io.seek(0)
    
    recognizer = sr.Recognizer()
    with sr.AudioFile(wav_io) as source:
        audio_data = recognizer.record(source)
        try:
            text = recognizer.recognize_google(audio_data)
        except sr.UnknownValueError:
            text = ""
    return text
