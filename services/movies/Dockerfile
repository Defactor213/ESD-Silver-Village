FROM python:3.10-bullseye

WORKDIR /app

ENV PYTHONUNBUFFERED=1

RUN apt-get update && \
  apt-get install -y dumb-init

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .
CMD ["dumb-init", "python", "-u", "main.py"]
