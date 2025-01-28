from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException, Request
from app.services.debate import call_debate  # Assuming call_debate is an async function
from app.services.analysis import call_analyze  # Assuming call_analyze is an async function
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.websocket("/debate")
async def debate_with_ai(websocket: WebSocket):
    """
    WebSocket endpoint for debating with AI.
    Listens for prompts and sends back responses.
    """
    await websocket.accept()  # Accept the WebSocket connection

    try:
        while True:
            # Receive prompt from the client (React frontend)
            prompt = await websocket.receive_text()
            logger.info(f"Received prompt: {prompt}")

            try:
                # Call the AI debate function
                response = await call_debate(prompt)

                # Ensure the response has the expected structure
                if "status" in response:
                    ai_response = "Debate AI service is working fine."
                else:
                    ai_response = "No valid response from AI service."

                # Send the AI response back to the frontend via WebSocket
                await websocket.send_text(ai_response)

            except Exception as e:
                # If there was an error in calling the AI service
                logger.error(f"Error calling AI service: {str(e)}")
                await websocket.send_text(f"AI Service Error: {str(e)}")

    except WebSocketDisconnect:
        logger.info("Client disconnected")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        await websocket.send_text(f"Unexpected error: {str(e)}")


@router.post("/analyze")
async def analyze_debate(request: Request):
    """
    Endpoint for analyzing a debate.
    Receives requests forwarded from the Go backend.
    """
    try:
        # Parse the JSON payload
        body = await request.json()
        logger.info(f"Received analysis request: {body}")
        debate_text = body.get("debate_text")

        if not debate_text:
            raise HTTPException(status_code=400, detail="Missing 'debate_text' in request body")

        # Prepare the analysis prompt
        prompt = f"Analyze the following debate and provide insights: {debate_text}"
        response = await call_analyze(prompt)

        # Ensure response structure is valid before returning
        analysis_result = response.get("status", "Analysis not available")

        # Return the AI's analysis result
        return {"analysis": analysis_result}
    except HTTPException as http_error:
        logger.error(f"HTTP error: {http_error.detail}")
        raise http_error
    except Exception as e:
        logger.error(f"Error analyzing debate: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI Service Error: {str(e)}")
