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
import json
import re
from themes import get_theme_prompt, THEMES

# Load environment variables (for local development)
load_dotenv()

# Flask app setup
app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Check if running in Google Cloud Run
def is_running_in_cloud_run():
    return os.environ.get('K_SERVICE') is not None

# Handle service account credentials
def setup_credentials():
    if is_running_in_cloud_run():
        # In Cloud Run, we'll use the Secret Manager for the service account key
        try:
            import google.auth
            from google.cloud import secretmanager

            # Create the Secret Manager client
            credentials, project_id = google.auth.default()
            client = secretmanager.SecretManagerServiceClient(credentials=credentials)
            
            # Access the secret
            secret_name = f"projects/{project_id}/secrets/sketchify-service-key/versions/latest"
            response = client.access_secret_version(name=secret_name)
            secret_content = response.payload.data.decode('UTF-8')
            
            # Save the secret content to a temporary file
            temp_key_path = "/tmp/service-key.json"
            with open(temp_key_path, 'w') as f:
                f.write(secret_content)
                
            # Set the environment variable to use this file
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = temp_key_path
            
            print("Successfully loaded service account key from Secret Manager")
            
        except Exception as e:
            logging.error(f"Error setting up credentials from Secret Manager: {e}")
            traceback.print_exc()
    else:
        # Local development - use the file path
        SERVICE_ACCOUNT_KEY_PATH = os.path.join(os.path.dirname(__file__), "sketchify-service-key.json")
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = SERVICE_ACCOUNT_KEY_PATH
        
        if not os.path.exists(SERVICE_ACCOUNT_KEY_PATH):
            print(f"WARNING: Service account key file not found at {SERVICE_ACCOUNT_KEY_PATH}")

# Setup credentials
setup_credentials()

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

def create_transformation_prompt(theme_name, theme_context, theme_prompt, user_prompt=""):
    """
    Create a detailed transformation prompt using theme information from themes.py
    """
    # Add style-specific enhancers for common themes to improve results
    style_enhancers = {
        "Minimalism": "clean lines, elegant simplicity, essential elements only, minimalist design",
        "Abstract": "abstract interpretation, non-literal, expressive colors, emotional resonance, abstract art style, free-form shapes",
        "Realism": "photorealistic details, true-to-life lighting and textures, accurate lighting and shadows, precise proportions, lifelike quality",
        "Anime": "anime style art, expressive eyes, vibrant colors, manga aesthetics, dynamic poses",
        "Cartoon": "cartoon style, bold outlines, exaggerated features, vibrant colors, playful aesthetic, whimsical elements, animated look",
        "Nature": "natural elements, organic forms, environmental harmony"
    }
    
    # Extract key concepts from the theme context (system prompt)
    # Remove instructions that are specific to description tasks
    clean_context = theme_context.replace("these are instructions for a diffusion model.", "")
    clean_context = clean_context.replace("Describe the sketch", "Transform the sketch")
    clean_context = clean_context.replace("in 1-2 sentences", "")
    
    # Extract style focus points from theme prompt (user prompt)
    # Remove instructions about descriptions and focus on style elements
    focus_points = theme_prompt.replace("Translate this sketch into", "Create")
    focus_points = focus_points.replace("description", "image")
    
    # Create a content-preserving transformation prompt
    transformation_prompt = f"Transform this sketch into a high-quality {theme_name} style image while preserving its key elements and composition. "
    
    # Add extracted style guidance from theme context
    if clean_context:
        # Find a good stopping point to extract the style guidance
        if "." in clean_context:
            # Use the first couple of sentences that define the style
            style_guidance = ". ".join(clean_context.split(".")[:2]) + "."
            transformation_prompt += f"{style_guidance} "
    
    # Add style enhancers if available for this theme
    if theme_name in style_enhancers:
        transformation_prompt += f"Include these style elements: {style_enhancers[theme_name]}. "
    
    # Add focus points from the theme prompt
    if "Focus on" in focus_points:
        focus_text = focus_points[focus_points.index("Focus on"):]
        transformation_prompt += f"{focus_text} "
    
    # Add user prompt if provided
    if user_prompt:
        transformation_prompt += f"Additional details: {user_prompt}. "
    
    return transformation_prompt

def all_in_one_gemini_request(image_base64, theme_name, theme_context, theme_prompt, user_prompt=""):
    """
    Make a single Gemini API call that:
    1. Analyzes the sketch
    2. Creates a style-specific prompt
    3. Generates a descriptive title
    4. Creates a user-friendly description
    """
    client = get_client()
    
    # Create a prompt that requests multiple outputs in a structured format
    all_in_one_prompt = f"""
You are an expert AI art assistant tasked with analyzing a sketch and providing information for style transformation.

First, examine the sketch carefully and identify exactly what is drawn.
"""

    # Only add the user request section if there actually is one
    if user_prompt:
        all_in_one_prompt += f"\nIMPORTANT USER REQUEST: {user_prompt}\n"

    all_in_one_prompt += f"""
    Then, provide the following information in this exact format:

    SKETCH_CONTENT: [Write a detailed factual analysis of what's in the sketch - objects, figures, composition]

    TRANSFORMATION_PROMPT: [Create a detailed prompt to transform this sketch into {theme_name} style while preserving the original content. Use these style elements: {theme_context}"""

    # Add user request instruction only if there is one
    if user_prompt:
        all_in_one_prompt += f". MAKE SURE to incorporate this user request: {user_prompt}"

    all_in_one_prompt += f"""]

    TITLE: [Create a memorable, specific 3-6 word title that focuses on the actual content of the sketch, NOT mentioning "{theme_name}", "art", "sketch" or "AI"]

    DESCRIPTION: [Write a brief, engaging 2-3 sentence description of how the sketch would look when transformed into {theme_name} style. Make it sound like a gallery caption, focusing on the actual content while mentioning the style elements]

    Follow this format exactly. Each section should be on its own line, with the exact labels as shown.
    """
    
    try:
        response = client.chat.completions.create(
            model=gemini_model,
            temperature=0.7,
            messages=[
                {
                    "role": "system",
                    "content": "You analyze sketches and provide detailed information for style transformation, titles, and descriptions."
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": all_in_one_prompt
                        },
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:image/png;base64,{image_base64}"}
                        }
                    ]
                }
            ]
        )
        
        full_response = response.choices[0].message.content.strip()
        print(f"Full Gemini response: {full_response}")
        
        # Extract the different sections using regex
        sketch_content_match = re.search(r'SKETCH_CONTENT:\s*(.*?)(?=\n\n[A-Z_]+:|$)', full_response, re.DOTALL)
        transformation_match = re.search(r'TRANSFORMATION_PROMPT:\s*(.*?)(?=\n\n[A-Z_]+:|$)', full_response, re.DOTALL)
        title_match = re.search(r'TITLE:\s*(.*?)(?=\n\n[A-Z_]+:|$)', full_response, re.DOTALL)
        description_match = re.search(r'DESCRIPTION:\s*(.*?)(?=\n\n[A-Z_]+:|$)', full_response, re.DOTALL)
        
        # Extract the matches or use defaults
        sketch_content = sketch_content_match.group(1).strip() if sketch_content_match else "A sketch"
        transformation_prompt = transformation_match.group(1).strip() if transformation_match else create_transformation_prompt(theme_name, theme_context, theme_prompt, user_prompt)
        title = title_match.group(1).strip() if title_match else f"{theme_name} Creation"
        description = description_match.group(1).strip() if description_match else f"A {theme_name.lower()} style artwork based on the sketch."
        
        # Clean up any quotation marks
        title = title.strip('"\'')
        description = description.strip('"\'')
        
        return {
            "sketch_content": sketch_content,
            "transformation_prompt": transformation_prompt,
            "title": title,
            "description": description
        }
    except Exception as e:
        logging.error(f"Error in all_in_one_gemini_request: {e}")
        traceback.print_exc()
        
        # Fallback to manual prompt creation
        transformation_prompt = create_transformation_prompt(theme_name, theme_context, theme_prompt, user_prompt)
        
        return {
            "sketch_content": "A sketch",
            "transformation_prompt": transformation_prompt,
            "title": f"{theme_name} Creation",
            "description": f"A {theme_name.lower()} style artwork based on the sketch."
        }

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "message": "Welcome to Sketchify.ai Single-Call API",
        "endpoints": [
            {"path": "/generate-prompt", "method": "POST", "description": "Generate an image from a sketch with a single API call"}
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
        "service_account": os.environ.get("GOOGLE_APPLICATION_CREDENTIALS") is not None,
        "api_key": api_key is not None
    })

@app.route('/generate-prompt', methods=['POST'])
def generate_prompt():
    """
    All-in-one image generation endpoint using just two API calls:
    1. Gemini (for analysis, prompt, title, and description)
    2. Imagen (for image generation)
    """
    try:
        data = request.json
        print("Full request data:", data)

        image_data = data.get("image")
        theme_data = data.get("theme", "Default")
        prompt_data = data.get("prompt", "")  # Additional prompt from the user
        complexity_data = data.get("complexity", "standard")  # Image quality setting

        print(f"Received prompt: {prompt_data}")
        print(f"Theme: {theme_data}")
        print(f"Complexity: {complexity_data}")

        # Get theme info from themes.py
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
            
            # STEP 1: Single call to Gemini for analysis, prompt, title, and description
            gemini_response = all_in_one_gemini_request(
                image_base64=clean_base64,
                theme_name=theme_data,
                theme_context=theme_context,
                theme_prompt=theme_prompt,
                user_prompt=prompt_data
            )
            
            # Extract the components from the response
            sketch_content = gemini_response["sketch_content"]
            transformation_prompt = gemini_response["transformation_prompt"]
            title = gemini_response["title"]
            description = gemini_response["description"]
            
            print(f"Sketch content: {sketch_content}")
            print(f"Transformation prompt: {transformation_prompt}")
            print(f"Title: {title}")
            print(f"Description: {description}")
            
            # Set quality based on complexity parameter
            quality = "hd" if complexity_data.lower() == "hd" else "standard"
            
            # STEP 2: Generate image using Imagen
            imagen_response = client.images.generate(
                model=imagen_model,
                prompt=transformation_prompt,
                response_format='b64_json',
                n=1,
                quality=quality,
            )
            
            # Extract the image
            img_base64 = imagen_response.data[0].b64_json
            
            # Return the response format expected by the client
            return jsonify({
                "image": img_base64,
                "description": description,
                "prompt": description[:100] + "..." if len(description) > 100 else description,
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
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)