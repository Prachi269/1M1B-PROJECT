FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy project files
COPY . .

# Expose port
EXPOSE 8080

# Run app with gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]
