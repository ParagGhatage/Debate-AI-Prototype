import httpx
from app.utils.config import LLM_API_KEY, LLM_API_URL

async def call_debate(prompt: str, max_tokens: int = 100):
    """Send a request to the OpenAI API."""
    headers = {"Authorization": f"Bearer {LLM_API_KEY}"}
    payload = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": max_tokens,
    }

    async with httpx.AsyncClient() as client:
        # response = await client.post(LLM_API_URL, headers=headers, json=payload)
        # response.raise_for_status()
        response={"status":"ok"}
        return response.json()
