from fastapi import APIRouter, HTTPException,Query , Request
from app.services.debate import call_debate
from app.services.analysis import call_analyze

router = APIRouter()

@router.post("/debate")
async def debate_with_ai(prompt: str):
    """
    Endpoint for debating with AI.
    """
    print(prompt)
    try:
        # response = await call_debate(prompt)
        # return {"response": response["choices"][0]["message"]["content"]}
        return {"response":"ok"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Service Error: {str(e)}")
@router.post("/analyze")
async def analyze_debate(request: Request):
    """
    Endpoint for analyzing a debate.
    Receives requests forwarded from the Go backend.
    """
    try:
        # Parse the JSON payload
        body = await request.json()
        print(body)
        debate_text = body.get("debate_text")

        if not debate_text:
            raise HTTPException(status_code=400, detail="Missing 'debate_text' in request body")

        # Prepare the analysis prompt
        prompt = f"Analyze the following debate and provide insights: {debate_text}"
        response = await call_analyze(prompt)

        # Return the AI's analysis result
        return {"analysis": response["status"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Service Error: {str(e)}")
