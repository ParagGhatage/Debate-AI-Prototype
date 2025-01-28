import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Configuration
LLM_API_KEY = os.getenv("LLM_API_KEY")
LLM_API_URL = os.getenv("LLM_API_URL")
