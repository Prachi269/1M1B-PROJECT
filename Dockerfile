# Use an official Python runtime
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy and install dependencies first (caching layer)
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy all project files
COPY . .

# Expose port (Railway sets PORT environment variable)
ENV PORT=8080
EXPOSE 8080

# Run the app with Gunicorn (bind to 0.0.0.0 and port from env)
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]
