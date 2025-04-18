FROM python:3.9-slim

WORKDIR /app

# Install compatible versions of packages
RUN pip install --no-cache-dir \
    flask==2.0.1 \
    flask-cors==3.0.0 \
    werkzeug==2.0.1 \
    gunicorn==20.1.0 \
    python-dotenv==1.0.1 \
    pillow==9.0.0 \
    requests==2.32.0 \
    openai==1.60.0

# Copy application files
COPY . .

# Expose the port
EXPOSE 8080

# Command to run the application
CMD exec gunicorn --bind :8080 --workers 1 --threads 8 --timeout 0 app:app