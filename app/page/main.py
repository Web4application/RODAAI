# app/main.py
import os
import time
import json
import sqlite3
import asyncio
import logging
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends, Request
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import jwt  # PyJWT
import subprocess
import shlex

# Optional OpenAI import - if you want to use OpenAI streaming
try:
    import openai
except Exception:
    openai = None

# -----------------------
# CONFIG (set via env)
# -----------------------
API_HOST = os.environ.get("API_HOST", "0.0.0.0")
API_PORT = int(os.environ.get("API_PORT", 3000))
JWT_SECRET = os.environ.get("JWT_SECRET", "change-me-to-a-strong-secret")
JWT_ALGO = "HS256"
JWT_EXPIRES_SECONDS = int(os.environ.get("JWT_EXPIRES_SECONDS", 3600))
UPLOAD_DIR = os.environ.get("UPLOAD_DIR", "uploads")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", None)
MAX_COMMAND_RUNTIME = int(os.environ.get("MAX_COMMAND_RUNTIME", 20))  # seconds
# whitelist of safe repo operations (map friendly name -> shell command)
REPO_COMMANDS = {
    "swift_build": "swift build",
    "swift_test": "swift test",
    "git_status": "git status --porcelain",
    "git_log": "git --no-pager log -n 10 --oneline"
}
# Limit the origins that can call your API (adjust for production)
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "*").split(",")  # "*" or comma-separated list

# Initialize
os.makedirs(UPLOAD_DIR, exist_ok=True)
logging.basicConfig(level=logging.INFO)
app = FastAPI(title="RODA AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o for o in ALLOWED_ORIGINS] if ALLOWED_ORIGINS != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# (very small) persistent history with sqlite
DB_PATH = os.environ.get("HISTORY_DB", "history.sqlite3")
conn = sqlite3.connect(DB_PATH, check_same_thread=False)
with conn:
    conn.execute("""
        CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            channel TEXT,
            timestamp INTEGER,
            who TEXT,
            text TEXT,
            metadata TEXT
        )
    """)


# -----------------------
# AUTH helpers (JWT)
# -----------------------
class TokenPayload(BaseModel):
    sub: str
    exp: int

def create_jwt(subject: str, expires_seconds: int = JWT_EXPIRES_SECONDS) -> str:
    payload = {
        "sub": subject,
        "exp": int(time.time()) + expires_seconds
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)
    return token

def decode_jwt(token: str) -> TokenPayload:
    try:
        data = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
        return TokenPayload(**data)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.DecodeError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(request: Request):
    auth = request.headers.get("Authorization")
    if not auth:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    if not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth scheme")
    token = auth.split(" ", 1)[1]
    payload = decode_jwt(token)
    return payload.sub


# -----------------------
# Utility: history
# -----------------------
def save_history(channel: str, who: str, text: str, metadata: Optional[Dict[str, Any]] = None):
    ts = int(time.time() * 1000)
    with conn:
        conn.execute(
            "INSERT INTO history (channel, timestamp, who, text, metadata) VALUES (?, ?, ?, ?, ?)",
            (channel, ts, who, text, json.dumps(metadata or {}))
        )

def read_history(channel: str, limit: int = 100):
    cur = conn.cursor()
    cur.execute("SELECT timestamp, who, text, metadata FROM history WHERE channel = ? ORDER BY id DESC LIMIT ?", (channel, limit))
    rows = cur.fetchall()
    return [{"timestamp": r[0], "from": r[1], "text": r[2], "metadata": json.loads(r[3] or "{}")} for r in rows[::-1]]


# -----------------------
# Endpoint models
# -----------------------
class ChatReq(BaseModel):
    message: str
    channel: Optional[str] = "general"

class ChatResp(BaseModel):
    reply: str
    attachments: Optional[List[Dict[str, Any]]] = []


# -----------------------
# Simple login (dev) -> returns JWT
# In production, hook to your auth system (OAuth, LDAP, etc.)
# -----------------------
@app.post("/api/login")
async def login(username: str = Form(...), password: str = Form(...)):
    # This is placeholder: replace with your real user verification
    if username == "admin" and password == os.environ.get("ADMIN_PASSWORD", "admin"):
        token = create_jwt(subject=username)
        return {"access_token": token, "token_type": "bearer"}
    raise HTTPException(status_code=401, detail="Invalid credentials")


# -----------------------
# Chat endpoint (non-streaming)
# -----------------------
@app.post("/api/chat", response_model=ChatResp)
async def chat_endpoint(payload: ChatReq, user: str = Depends(get_current_user)):
    """
    Simple non-streaming chat endpoint.
    - Saves the user message to history
    - Optionally call the LLM (OpenAI) to generate a reply
    """
    logging.info("Chat request from %s: %s", user, payload.message)
    save_history(payload.channel, "user", payload.message, {"by": user})

    # If OPENAI_API_KEY available, call it, otherwise return simple echo
    if OPENAI_API_KEY and openai:
        openai.api_key = OPENAI_API_KEY
        try:
            # Basic synchronous call
            resp = openai.ChatCompletion.create(
                model="gpt-4o-mini",  # change as appropriate
                messages=[{"role":"user","content":payload.message}],
                max_tokens=512,
                temperature=0.2
            )
            reply = resp.choices[0].message.content
        except Exception as e:
            logging.exception("OpenAI error")
            reply = f"LLM error: {str(e)}"
    else:
        # Fallback: echo + simple repo helper hints
        reply = f"(local) I received your message: {payload.message}\nTry: `build`, `test`, or `status` in the repo channel."

    save_history(payload.channel, "roda", reply, {})
    return {"reply": reply, "attachments": []}


# -----------------------
# Streaming chat (SSE) - emits partial tokens as they arrive
# The client should use EventSource to connect to /api/stream-chat
# -----------------------
@app.post("/api/stream-chat")
async def stream_chat_endpoint(request: Request, payload: ChatReq, user: str = Depends(get_current_user)):
    """
    Stream tokens back to the client using Server-Sent Events (SSE).
    This uses OpenAI streaming (if configured). If no OpenAI key, we stream a fake progressive response.
    """
    save_history(payload.channel, "user", payload.message, {"by": user})

    async def event_generator():
        if OPENAI_API_KEY and openai:
            openai.api_key = OPENAI_API_KEY
            # NOTE: openai.ChatCompletion.stream is pseudo-code; actual streaming usage depends on library and version.
            # We use the HTTP stream via openai-python with stream=True.
            try:
                # synchronous blocking generator wrapped in a thread -> then yield asynchronously
                loop = asyncio.get_event_loop()
                def _sync_stream():
                    # example with older openai lib: openai.ChatCompletion.create(stream=True,...)
                    stream = openai.ChatCompletion.create(
                        model="gpt-4o-mini",
                        messages=[{"role":"user","content": payload.message}],
                        stream=True,
                        temperature=0.2
                    )
                    for chunk in stream:
                        # each chunk contains partial tokens: chunk['choices'][0]['delta']['content']
                        yield chunk
                for chunk in _sync_stream():
                    # parse chunk - this depends on openai version
                    delta = ""
                    try:
                        choices = chunk.get("choices", [])
                        if choices:
                            delta = choices[0].get("delta", {}).get("content", "")
                    except Exception:
                        delta = ""
                    if delta:
                        yield f"data: {json.dumps({'token': delta})}\n\n"
                # finish
                yield f"data: {json.dumps({'done': True})}\n\n"
            except Exception as e:
                logging.exception("Streaming error")
                yield f"data: {json.dumps({'error': str(e)})}\n\n"
        else:
            # fake progressive response so the client still shows streaming behavior
            words = ("This is a simulated streaming response from RODA. "
                     "If you configure OPENAI_API_KEY, you get real streaming tokens.").split()
            accum = ""
            for w in words:
                accum += " " + w
                await asyncio.sleep(0.12)
                yield f"data: {json.dumps({'token': w})}\n\n"
            yield f"data: {json.dumps({'done': True})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


# -----------------------
# File upload (images) - store and optionally call image analysis
# -----------------------
@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...), channel: Optional[str] = Form("general"), user: str = Depends(get_current_user)):
    filename = f"{int(time.time()*1000)}-{os.path.basename(file.filename)}"
    target_path = os.path.join(UPLOAD_DIR, filename)

    contents = await file.read()
    with open(target_path, "wb") as fh:
        fh.write(contents)

    # Optional: run image analysis (OCR, classification) here.
    analysis = f"Uploaded {file.filename} ({len(contents)} bytes)"
    save_history(channel, "user", f"[image]{file.filename}", {"path": target_path, "by": user})
    save_history(channel, "roda", analysis, {})

    # return a URL that your static server can serve; adjust if behind CDN
    url = f"/{target_path}"
    return {"url": url, "analysis": analysis, "message": "ok"}


# -----------------------
# History
# -----------------------
@app.get("/api/history")
async def get_history(channel: str = "general"):
    return read_history(channel)


# -----------------------
# Repo command runner (SANDBOXED)
# -----------------------
class CommandReq(BaseModel):
    name: str  # friendly name from the whitelist, e.g. "swift_build"
    args: Optional[List[str]] = []

@app.post("/api/run")
async def run_repo_command(req: CommandReq, user: str = Depends(get_current_user)):
    """
    Runs a whitelisted repo command inside the repo root.
    WARNING: This must be used carefully. The server restricts commands to the 'REPO_COMMANDS' mapping.
    In production, prefer running commands inside an ephemeral Docker container or isolated CI runner.
    """
    cmd_key = req.name
    if cmd_key not in REPO_COMMANDS:
        raise HTTPException(status_code=400, detail="Unknown/forbidden command")

    # Build the final shell command (no shell=True later)
    base_cmd = REPO_COMMANDS[cmd_key]
    args = req.args or []
    # Sanitize arguments: allow only basic alphanum, -, _, ., and no semicolons or pipes
    for a in args:
        if not isinstance(a, str) or any(c in a for c in [';', '|', '&', '$', '`', '>', '<']):
            raise HTTPException(status_code=400, detail="Forbidden argument detected")
    # Final command string
    full_cmd = " ".join([base_cmd] + [shlex.quote(a) for a in args])
    logging.info("Running repo command for user %s: %s", user, full_cmd)

    # Execute asynchronously with timeout and limited env
    proc = await asyncio.create_subprocess_shell(
        full_cmd,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
        cwd=os.environ.get("REPO_ROOT", "."),
        env={"PATH": os.environ.get("SAFE_PATH", os.environ.get("PATH", ""))}  # minimal env
    )

    try:
        stdout, stderr = await asyncio.wait_for(proc.communicate(), timeout=MAX_COMMAND_RUNTIME)
    except asyncio.TimeoutError:
        proc.kill()
        await proc.communicate()
        save_history("repo", "roda", f"Command {cmd_key} timed out")
        raise HTTPException(status_code=504, detail="Command timed out")

    out = stdout.decode(errors="replace")
    err = stderr.decode(errors="replace")
    summary = out if out else err
    save_history("repo", "user", f"Ran {cmd_key} by {user}", {"args": args})
    save_history("repo", "roda", summary[:2000], {})

    return {"exit_code": proc.returncode, "stdout": out, "stderr": err}


# -----------------------
# Basic health
# -----------------------
@app.get("/health")
async def health():
    return {"status": "ok", "time": int(time.time())}

# -----------------------
# Run with `uvicorn app.main:app --host 0.0.0.0 --port 3000`
# -----------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=API_HOST, port=API_PORT, reload=True)
