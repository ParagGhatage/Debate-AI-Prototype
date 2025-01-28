import httpx
from app.utils.config import LLM_API_KEY, LLM_API_URL

async def call_analyze(prompt: str, max_tokens: int = 100):
    """Send a request to the OpenAI API."""
    headers = {"Authorization": f"Bearer {LLM_API_KEY}"}
    payload = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": max_tokens,
    }

    async with httpx.AsyncClient() as client:
        # Make the request to the AI service (currently simulated with a dummy response)
        response = {"status": "ok"}  # You should uncomment and use the actual API request
        # response = await client.post(LLM_API_URL, headers=headers, json=payload)
        # response.raise_for_status()

        # Return the parsed response from the AI service
        return response
