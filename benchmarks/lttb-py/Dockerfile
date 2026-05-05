FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt ./
# libpq-dev is needed to compile psycopg2
RUN apt-get update && apt-get install -y libpq-dev gcc && \
    pip install --no-cache-dir -r requirements.txt && \
    apt-get purge -y gcc && apt-get autoremove -y && rm -rf /var/lib/apt/lists/*
COPY . .
ENV PYTHONUNBUFFERED=1
CMD ["python", "main.py"]
