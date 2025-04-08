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
from themes import get_theme_prompt, THEMES

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

def create_transformation_prompt(theme_name, theme_context, theme_prompt, user_prompt=""):
    """
    Create a detailed transformation prompt using theme information from themes.py
    """
    # Add style-specific enhancers for common themes to improve results
    style_enhancers = {
        "Minimalism": "clean lines, elegant simplicity, essential elements only, minimalist design",
        "Abstract": "abstract art style, emotional expression through color and form",
        "Realism": "photorealistic details, true-to-life lighting and textures",
        "Anime": "anime style art, expressive eyes, vibrant colors, manga aesthetics",
        "Cartoon": "cartoon style, bold outlines, exaggerated features, animated look",
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
    
    # Create a transformation prompt that combines:
    # 1. Clear instruction to transform the sketch
    # 2. Key style elements from the theme context
    # 3. Focus points from the theme prompt
    # 4. Additional style enhancers for better results
    # 5. User's additional prompt if provided
    
    transformation_prompt = f"Transform this sketch into a high-quality {theme_name} style image. "
    
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
        transformation_prompt += f"Additional details: {user_prompt}"
        
    return transformation_prompt

def generate_creative_description(transformed_image_prompt, theme):
    """
    Generate a user-friendly description of the image that doesn't sound like a prompt.
    """
    client = get_client()
    
    description_prompt = f"""
    Based on this image generation prompt:
    "{transformed_image_prompt}"
    
    Write a brief, engaging description (2-3 sentences) of the resulting image that a user would 
    enjoy reading. Make it sound like you're describing a finished artwork, not like you're giving 
    instructions to an AI.
    
    The description should:
    1. Focus on the visual elements and subject matter
    2. Mention the {theme} style in a natural way
    3. Sound like a gallery description or social media caption
    4. Be written in present tense, describing what IS in the image
    5. Avoid phrases like "this sketch depicts" or "this image shows"
    
    Example of good description:
    "A serene mountain lake reflects the sunset sky, with golden light catching the peaks. The minimalist 
    style emphasizes clean lines and essential elements, creating a tranquil scene of natural beauty."
    """
    
    try:
        response = client.chat.completions.create(
            model=gemini_model,
            temperature=0.7,
            messages=[
                {
                    "role": "system",
                    "content": "You write engaging, concise descriptions of artwork for users to read."
                },
                {
                    "role": "user",
                    "content": description_prompt
                }
            ]
        )
        
        description = response.choices[0].message.content.strip()
        
        # Clean up any quotation marks that might have been included
        description = description.strip('"\'')
        
        return description
    except Exception as e:
        logging.error(f"Error generating creative description: {e}")
        # Fallback option - create a simple description based on theme
        return f"A creative {theme.lower()} style artwork based on your original sketch."

def generate_title(image_description, theme):
    """
    Generate a descriptive title based on the image description.
    """
    client = get_client()
    
    title_prompt = f"""
    Based on this image description:
    "{image_description}"
    
    Create a short, creative title (3-6 words) that captures the essence of the image.
    
    The title should:
    1. Focus on the main subject or feeling of the image
    2. Be memorable and interesting
    3. NOT include words like "sketch", "AI", "generated", or "{theme}"
    4. NOT be generic like "Beautiful Landscape" or "Artistic Creation"
    
    Return ONLY the title, with no quotes or explanation.
    """
    
    try:
        response = client.chat.completions.create(
            model=gemini_model,
            temperature=0.6,
            messages=[
                {
                    "role": "system",
                    "content": "You create concise, creative titles for artwork."
                },
                {
                    "role": "user",
                    "content": title_prompt
                }
            ],
            max_tokens=10
        )
        
        title = response.choices[0].message.content.strip()
        
        # Clean up any quotation marks that might have been included
        title = title.strip('"\'')
        
        # Check if title is too generic or contains theme name
        if (len(title.split()) < 2 or 
            theme.lower() in title.lower() or 
            any(word in title.lower() for word in ["ai", "sketch", "art", "creation", "generated"])):
            
            # Try one more time with stronger instructions
            retry_prompt = f"""
            Create a SPECIFIC and CREATIVE title (3-6 words) for this image: "{image_description}"
            
            DO NOT use generic words or include "{theme}", "AI", "sketch", or "art".
            Focus on the EXACT subject matter and feeling. Be precise and imaginative.
            
            Examples of good titles: "Moonlit Mountain Journey", "Whispering Forest Spirits", "Neon City Dreams"
            Examples of bad titles: "Beautiful Art", "Creative Sketch", "Amazing {theme}"
            
            Return ONLY the title with no explanation.
            """
            
            retry_response = client.chat.completions.create(
                model=gemini_model,
                temperature=0.7,
                messages=[
                    {
                        "role": "system",
                        "content": "You create specific, creative titles focusing on exact content."
                    },
                    {
                        "role": "user",
                        "content": retry_prompt
                    }
                ],
                max_tokens=10
            )
            
            title = retry_response.choices[0].message.content.strip().strip('"\'')
        
        return title
    except Exception as e:
        logging.error(f"Error generating title: {e}")
        
        # Extract potential keywords from the description as fallback
        try:
            words = image_description.split()
            if len(words) >= 3:
                return " ".join(words[0:3])
            else:
                return f"{theme} Creation"
        except:
            return f"{theme} Creation"

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "message": "Welcome to Sketchify.ai One-Pass API",
        "endpoints": [
            {"path": "/generate-prompt", "method": "POST", "description": "Generate an image from a sketch using direct Imagen transformation"}
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

@app.route('/generate-prompt', methods=['POST'])
def generate_prompt():
    """
    One-pass image generation directly from a sketch using Imagen
    """
    try:
        data = request.json
        image_data = data.get("image")
        theme_data = data.get("theme", "Default")
        prompt_data = data.get("prompt", "")  # Additional prompt from the user

        print(f"Received prompt: {prompt_data}")
        print(f"Theme: {theme_data}")

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
            
            # Create the transformation prompt using theme information from themes.py
            transformation_prompt = create_transformation_prompt(
                theme_name=theme_data,
                theme_context=theme_context,
                theme_prompt=theme_prompt,
                user_prompt=prompt_data
            )
            
            print(f"Transformation prompt: {transformation_prompt}")
            
            # Generate image directly using Imagen
            imagen_response = client.images.generate(
                model=imagen_model,
                prompt=transformation_prompt,
                response_format='b64_json',
                n=1,
            )
            
            # Extract the image
            img_base64 = imagen_response.data[0].b64_json
            
            # Generate a user-friendly description for the image
            user_description = generate_creative_description(transformation_prompt, theme_data)
            print(f"Generated user description: {user_description}")
            
            # Generate a creative title based on the description
            title = generate_title(user_description, theme_data)
            print(f"Generated title: {title}")
            
            # Return the response format expected by the client
            return jsonify({
                "image": img_base64,
                "description": user_description,  # User-friendly description
                "prompt": user_description[:100] + "..." if len(user_description) > 100 else user_description,
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