import os
from flask import Flask, request, jsonify
import base64
from flask_cors import CORS
import logging
from dotenv import load_dotenv
from io import BytesIO
import binascii
from PIL import Image
from openai import OpenAI
import traceback

# Load environment variables
load_dotenv()

# Flask app setup
app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Path to service account key file (relative to this script)
# This makes it easy for team members to run the app as long as they have the key file
SERVICE_ACCOUNT_KEY_PATH = os.path.join(os.path.dirname(__file__), "sketchify-service-key.json")

# Set environment variable for Google authentication
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = SERVICE_ACCOUNT_KEY_PATH

# Gemini API setup
api_key = os.getenv("GEMINI_API_KEY")

# Models
gemini_model = "gemini-2.0-flash"  # For sketch description
imagen_model = "imagen-3.0-generate-002"  # For image generation

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
            # Add any needed padding
            missing_padding = len(image_base64) % 4
            if missing_padding:
                image_base64 += "=" * (4 - missing_padding)
                
            # Try to decode with various approaches
            try:
                # Try standard decoding
                image_binary = base64.b64decode(image_base64)
            except binascii.Error:
                # If that fails, try with validate=False
                image_binary = base64.b64decode(image_base64, validate=False)
                
            # Process through PIL for reliable image handling
            image = Image.open(BytesIO(image_binary))
            
            # Save image to a BytesIO object
            buffered = BytesIO()
            image.save(buffered, format="PNG")
            image_bytes = buffered.getvalue()
            
            # Convert to base64 for API
            clean_base64 = base64.b64encode(image_bytes).decode("utf-8")
            
            print(f"Successfully processed image, size: {len(image_bytes)} bytes")
            
            # Get client with API key
            client = get_client()
            
            # Generate description using Gemini through OpenAI compatibility
            response = client.chat.completions.create(
                model=gemini_model,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are an expert visual descriptor tasked with analyzing sketches for an AI image generation pipeline. "
                            "Your job is to describe the sketch in vivid, precise detail, capturing every visible element—shapes, lines, textures, objects, and composition—without losing context. "
                            "Focus on what is explicitly present, avoiding assumptions or embellishments beyond the sketch itself. "
                            "Structure the description as a concise, natural paragraph optimized for an image generation model, using evocative yet specific language."
                        )
                    },
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": (
                                    "Provide a detailed, vivid description of this sketch as a single paragraph. "
                                    "Include all visible elements—shapes, lines, objects, and their arrangement—using precise, evocative language suitable for generating a high-quality AI image. "
                                    "Do not add labels like 'Description:' or interpret beyond what is shown."
                                )
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
            
            # Extract the image from the response
            img_base64 = imagen_response.data[0].b64_json
            
            return jsonify({
                "image": img_base64,
                "description": description
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
    
    # Check if API key is set
    if not api_key:
        print("WARNING: GEMINI_API_KEY environment variable not set")
        print("Set this in your .env file or environment variables")
    
    # Run the app
    app.run(debug=True, port=5001, threaded=True)