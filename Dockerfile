# RODA AI FastAPI Dockerfile 🧠⚙️
FROM python:3.13-slim AS base

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
 && pip install --no-cache-dir -r requirements.txt \
 && apt-get remove -y build-essential gcc \
 && apt-get autoremove -y && apt-get clean \
 && rm -rf /var/lib/apt/lists/*
 RUN -it -e NGROK_AUTHTOKEN=33OQXTTTmyIjVh21zBDVmxGY28O_3PhK4sybzSw72Nm2a8Dfy ngrok/ngrok:latest http --url=unreceivable-charlsie-superingeniously.ngrok-free.dev host.docker.internal:80

# Copy source code
COPY . .
docker pull ngrok/ngrok
# Use production-grade server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

run -it -e NGROK_AUTHTOKEN=33OQXTTTmyIjVh21zBDVmxGY28O_3PhK4sybzSw72Nm2a8Dfy ngrok/ngrok:latest http --url=unreceivable-charlsie-superingeniously.ngrok-free.dev host.docker.internal:80
