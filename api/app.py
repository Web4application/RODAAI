# sample end-points (FastAPI)
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.post("/api/chat")
async def chat(payload: dict):
    message = payload.get("message","")
    channel = payload.get("channel","general")
    # run your AI / repo logic here...
    reply = f"Echo from server: {message}"
    return {"reply": reply, "attachments": []}

@app.post("/api/upload")
async def upload(file: UploadFile = File(...), channel: str = Form(None)):
    contents = await file.read()
    # store and analyze
    url = f"/static/uploads/{file.filename}"
    analysis = "Image received"
    return {"url": url, "analysis": analysis}

@app.get("/api/history")
async def history(channel: str = "general"):
    # pull from DB or memory
    return [{"timestamp": 0, "text": "Welcome", "analysis": "init", "from": "roda"}]
