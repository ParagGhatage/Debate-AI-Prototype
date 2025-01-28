import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

LLM_API_URL = os.getenv("LLM_API_URL", "https://api.openai.com")
LLM_API_KEY = os.getenv("LLM_API_KEY", "your-api-key-here")
GO_BACKEND_URL = os.getenv("GO_BACKEND_URL", "http://localhost:8080")

# You can add more configurations like logging, database, etc.
