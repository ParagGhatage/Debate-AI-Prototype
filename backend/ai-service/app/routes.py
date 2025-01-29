from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.responses import JSONResponse
import logging
from huggingface_hub import InferenceClient
from pydantic import BaseModel

# Router setup
router = APIRouter()

logger = logging.getLogger("uvicorn")

# Initialize Hugging Face Inference API client
api_key = "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"  # Replace with your actual Hugging Face API key
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
        
# Define the data structure for the incoming request
class Message(BaseModel):
    role: str
    content: str

class AnalyzeRequest(BaseModel):
    messages: list[Message]
    
    
# Hugging Face API URL and model details
HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct"
HEADERS = {
    "Authorization": "Bearer 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"
}


# POST route for /analyze to handle incoming messages
@router.post("/analyze")
async def analyze(request: AnalyzeRequest):
    try:
        print(request)
        # Log the incoming request data
        logger.info(f"Received analyze request: {request.json()}")
        
        # Loop through the messages and process each one
        for message in request.messages:
            logger.info(f"Processing message - Role: {message.role}, Content: {message.content}")
            # You can now pass this to another service or process it here
        system_prompt = f"Analyze user messages and give points out of 10 and give tips for following messages: {request.messages}"
        
        # Get response from Hugging Face API (no 'await' here)
        response = client.chat.completions.create(
            model="meta-llama/Meta-Llama-3-8B-Instruct",
            messages=[{"role": "user", "content": system_prompt}]
        )
        
        # Here we could forward the message to your AI service for further processing or analysis
        # You can call your debate model or any other service here as needed

        # Send a response confirming the received messages
        return JSONResponse(content={"message": response.choices[0].message['content']}, status_code=200)

    except Exception as e:
        logger.error(f"Error processing the analyze request: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

