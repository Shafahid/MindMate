import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    HF_API_KEY: str = os.getenv("HF_API_KEY", "")

settings = Settings()
