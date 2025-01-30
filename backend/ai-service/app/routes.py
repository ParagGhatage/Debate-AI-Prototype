from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.responses import JSONResponse
import logging
from huggingface_hub import InferenceClient
from pydantic import BaseModel
import os

# Router setup
router = APIRouter()

logger = logging.getLogger("uvicorn")

# Initialize Hugging Face Inference API client
api_key = os.environ.get("LLM_API_KEY")  # Replace with your actual Hugging Face API key
client = InferenceClient(token=api_key)
model_id = "meta-llama/Meta-Llama-3-8B-Instruct"  # Model you want to use



# Function to call the debate model
async def call_debate(user_input: str):
    try:
        # Prepare the system prompt and the user input
        system_prompt = f"You are a skilled debater. Respond to the following argument: {user_input}"

        # Get response from Hugging Face API (no 'await' here)
        response = client.chat.completions.create(
            model=model_id,
            messages=[{"role": "user", "content": system_prompt}]
        )

        # Return the AI response
        return response.choices[0].message['content']
    except Exception as e:
        logger.error(f"AI service error: {str(e)}")
        return "Error processing your request."

# WebSocket route to simulate debate (already existing)
@router.websocket("/debate")
async def debate_with_ai(websocket: WebSocket):
    await websocket.accept()

    try:
        while True:
            try:
                prompt = await websocket.receive_text()
                logger.info(f"Received prompt: {prompt}")
                
                ai_response = await call_debate(prompt)  # Get response from the debate function
                await websocket.send_text(ai_response)  # Send AI response back to the client
            except WebSocketDisconnect:
                logger.info("Client disconnected")
                break
            except Exception as e:
                logger.error(f"Unexpected error: {str(e)}")
                await websocket.send_text(f"Error: {str(e)}")
    finally:
        await websocket.close()
        

    
   