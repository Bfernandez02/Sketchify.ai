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

def get_client():
    return OpenAI(
        api_key=api_key,
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
    )

def generate_title_from_description(description, theme):
    """
    Generate a descriptive title based on the actual content of the image description.
    """
    client = get_client()
    
    prompt = f"""
    Analyze this image description and create a specific, descriptive title (4-8 words) that focuses on the EXACT SUBJECT and CONTENT of the image. 
    
    DO NOT use generic phrases like "AI-enhanced", "Artistic", "Creative" or "{theme}" in the title.
    
    Description: "{description}"
    
    Instructions:
    1. Identify the MAIN SUBJECT of the image (person, animal, landscape, object, etc.)
    2. Include specific details about what the subject is DOING or what makes it UNIQUE
    3. Create a title that would help someone visualize the EXACT image without seeing it
    4. Avoid mentioning AI, sketches, or the theme/style - focus only on the actual content
    
    Return ONLY the title text without quotes or additional explanation.
    """
    
    try:
        response = client.chat.completions.create(
            model=gemini_model,
            temperature=0.4,  # Lower temperature for more precise output
            messages=[
                {
                    "role": "system",
                    "content": "You are a precise image captioning system that creates specific, descriptive titles focusing on the exact content of images."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=15  # Keep it concise
        )
        
        title = response.choices[0].message.content.strip()
        # Remove quotes if present
        title = title.strip('"\'')
        
        # If the title is still generic, extract key elements from description as fallback
        if any(generic in title.lower() for generic in ["ai", "sketch", "art", "creative", "artistic", theme.lower()]):
            # Try one more time with stronger instructions
            retry_prompt = f"""
            The image description is: "{description}"
            
            Create a VERY SPECIFIC title about the EXACT subject and content. 
            ABSOLUTELY NO mentions of AI, art styles, or "{theme}".
            Focus ONLY on what is literally depicted (e.g., "Mountain Lake at Sunset", "Fox Hunting in Snow").
            """
            
            retry_response = client.chat.completions.create(
                model=gemini_model,
                temperature=0.2,  # Even lower temperature
                messages=[
                    {
                        "role": "system",
                        "content": "You create literal, specific image titles based only on content."
                    },
                    {
                        "role": "user",
                        "content": retry_prompt
                    }
                ],
                max_tokens=15
            )
            
            title = retry_response.choices[0].message.content.strip().strip('"\'')
        
        return title
    except Exception as e:
        logging.error(f"Error generating title: {e}")
        # Extract key nouns from description as fallback
        try:
            # Use a simpler prompt to get key subject
            key_elements_prompt = f"What is the main subject of this image: {description[:100]}? Answer in 2-4 words ONLY."
            simple_response = client.chat.completions.create(
                model=gemini_model,
                temperature=0.1,
                messages=[{"role": "user", "content": key_elements_prompt}],
                max_tokens=10
            )
            subject = simple_response.choices[0].message.content.strip().strip('"\'')
            return subject
        except:
            return f"{theme.capitalize()} Scene"  # Ultimate fallback

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
        theme_data = data.get("theme", "Default")  # Default to minimalism if no theme provided
        prompt_data = data.get("userPrompt","") # Retrive the additional prompt from the json data
        complexity_data = data.get("complexity", "standard")  # Default to Medium if no complexity provided

        steps_dict = {
            "standard":"standard",
            "HD": "hd",
        }

        quality = steps_dict.get(complexity_data, "standard")  # Default to Medium if not found   

     
    


        print(f"Received prompt: {prompt_data}")
        print(f"Theme: {theme_data}")

        # Get theme info ONCE and use it consistently
        theme_context, theme_prompt, temperature = get_theme_prompt(theme_data)

        final_prompt = theme_prompt  # Start with the theme prompt
        print(f" here is the additonal prompt{prompt_data}")
        # Append user prompt if provided
        if prompt_data!="":
            final_prompt = f"{theme_prompt}\n Additional requirements: {prompt_data}"
            logging.info(f"Added user prompt to theme: {prompt_data}")
            print("In the if statement")

        print(f"Final prompt: {final_prompt}")
            
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
                                "text": final_prompt
                              
                                
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
                quality= quality,
            )
            
            # Extract the image
            img_base64 = imagen_response.data[0].b64_json
            
            # Generate a creative title based on the description
            title = generate_title_from_description(description, theme_data)
            
            return jsonify({
                "image": img_base64,
                "description": description,
                "prompt": description[:100] + "...",  
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