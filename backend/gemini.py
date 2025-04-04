import os
from flask import Flask, request, jsonify
import base64
from flask_cors import CORS
import logging
from dotenv import load_dotenv
from io import BytesIO
from PIL import Image
import requests
from openai import OpenAI
import traceback
import binascii

import requests
import json
from themes import get_theme_prompt

load_dotenv()
# Flask app setup
app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Path to service account key file
SERVICE_ACCOUNT_KEY_PATH = os.path.join(os.path.dirname(__file__), "sketchify-service-key.json")
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = SERVICE_ACCOUNT_KEY_PATH

# Gemini API setup
api_key = os.getenv("GEMINI_API_KEY")

# Models
gemini_model = "gemini-2.0-flash" 
imagen_model = "imagen-3.0-generate-002" 

# Initialize OpenAI client with Gemini API base URL
def get_client():
    return OpenAI(
        api_key=api_key,
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
    )

# Endpoints
@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "message": "Welcome to Sketchify.ai Gemini API Test",
        "endpoints": [
            {"path": "/generate-prompt", "method": "POST", "description": "Generate an image from a sketch using Gemini and Imagen 3"},
            {"path": "/get-image", "method": "POST", "description": "Process an uploaded image"}
        ]
    })

@app.before_request
def log_request_info():
    app.logger.debug('Headers: %s', request.headers)
    app.logger.debug('Body: %s', request.get_data())
    app.logger.debug('Path: %s', request.path)
    if request.path == '/generate-prompt' and request.method == 'POST':
        app.logger.debug('Theme: %s', request.json.get('theme'))

@app.after_request
def log_response_info(response):
    app.logger.debug('Response Status: %s', response.status)
    return response

@app.route('/test', methods=['GET', 'POST'])
def test():
    return jsonify({
        "status": "connected",
        "service_account": os.path.exists(SERVICE_ACCOUNT_KEY_PATH),
        "api_key": api_key is not None
    })

@app.route('/get-image', methods=['POST'])
def get_photo():
    data = request.json
    image_data = data.get("image")
    
    if not image_data:
        print("No image found!")
        return jsonify({"error": "No image provided"}), 400
    
    print('Received image')
    return jsonify({"status": "received image"}), 200

@app.route('/generate-prompt', methods=['POST'])
def generate_prompt():
    try:
        data = request.json
        image_data = data.get("image")
        theme_data = data.get("theme", "minimalism")  # Default to minimalism if no theme provided
        
        print(f"Theme: {theme_data}")

        # Get theme info ONCE and use it consistently
        theme_context, theme_prompt, temperature = get_theme_prompt(theme_data)
        logging.info(f"Using theme: {theme_data} with temperature: {temperature}")

        if not image_data:
            print("No image found!")
            return jsonify({"error": "No image provided"}), 400
        
        # Extract base64 data
        if "," in image_data:
            image_base64 = image_data.split(",")[1]
        else:
            image_base64 = image_data
            
        # Process the image through PIL to ensure clean data
        try:
            # Add padding if needed
            missing_padding = len(image_base64) % 4
            if missing_padding:
                image_base64 += "=" * (4 - missing_padding)
                
            # Decode base64
            try:
                image_binary = base64.b64decode(image_base64)
            except binascii.Error:
                image_binary = base64.b64decode(image_base64, validate=False)
                
            # Process through PIL
            image = Image.open(BytesIO(image_binary))
            buffered = BytesIO()
            image.save(buffered, format="PNG")
            image_bytes = buffered.getvalue()
            clean_base64 = base64.b64encode(image_bytes).decode("utf-8")
            
            print(f"Successfully processed image, size: {len(image_bytes)} bytes")
            
            # Get client
            client = get_client()
            
            # Generate description using Gemini
            response = client.chat.completions.create(
                model=gemini_model,
                temperature=temperature,
                messages=[
                    {
                        "role": "system",
                        "content": theme_context
                    },
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": theme_prompt
                            },
                            {
                                "type": "image_url",
                                "image_url": {"url": f"data:image/png;base64,{clean_base64}"}
                            }
                        ]
                    }
                ]
            )
            
            description = response.choices[0].message.content
            print(f"Generated description: {description}")
            
            # Generate image using Imagen
            imagen_response = client.images.generate(
                model=imagen_model,
                prompt=description,
                response_format='b64_json',
                n=1,
            )
            
            # Extract the image
            img_base64 = imagen_response.data[0].b64_json
            
            # Optional: include title and prompt based on the description
            title = f"AI Enhanced Sketch ({theme_data.capitalize()})"
            
            return jsonify({
                "image": img_base64,
                "description": description,
                "prompt": description[:100] + "...",  # Shortened version as prompt
                "title": title
            }), 200
            
        except Exception as e:
            print(f"Error processing image: {e}")
            traceback.print_exc()
            return jsonify({"error": f"Image processing error: {str(e)}"}), 500
            
    except Exception as e:
        logging.error(f"Error: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    if not os.path.exists(SERVICE_ACCOUNT_KEY_PATH):
        print(f"WARNING: Service account key file not found at {SERVICE_ACCOUNT_KEY_PATH}")
        print("Make sure to include the key file in the project directory")
    else:
        print(f"Using service account credentials from: {SERVICE_ACCOUNT_KEY_PATH}")
    
    if not api_key:
        print("WARNING: GEMINI_API_KEY environment variable not set")
        print("Set this in your .env file or environment variables")
    
    app.run(debug=True, port=5001, threaded=True)