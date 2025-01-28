# main.py
from fastapi import FastAPI
from app.routes import router  # Import the router from routes.py
import uvicorn

app = FastAPI()

# Include the router from routes.py
app.include_router(router)

@app.get("/")
def root():
    return {"message": "AI Service is up and running!"}

# Run the app programmatically
if __name__ == "__main__":
    uvicorn.run(app, port=8000)
