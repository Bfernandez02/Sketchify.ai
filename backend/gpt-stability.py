import os
from flask import Flask, request, json, jsonify
import base64
from flask_cors import CORS
import logging
import requests
from openai import OpenAI
import openai
from dotenv import load_dotenv
load_dotenv()
from io import BytesIO
from PIL import Image
import traceback
from themes import get_theme_prompt

app = Flask(__name__)
openai.api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI()
CORS(app)

stable_diffusion_api_url = 'https://api.stability.ai/v2beta/stable-image/generate/ultra'
stable_diffusion_apiKey = os.getenv("STABILITY_API_KEY")

def generate_title_from_description(description, theme):
    """
    Generate a descriptive title based on the actual content of the image description.
    """
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
            model="gpt-4o-mini",
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
                model="gpt-4o-mini",
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
                model="gpt-4o-mini",
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
        "message": "Welcome to Sketchify.ai API",
        "endpoints": [
            {"path": "/generate-prompt", "method": "POST", "description": "Generate an image from a sketch"},
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
    return jsonify({"status": "connected"})

@app.route('/get-image', methods=['POST'])
def get_photo():     
    data = request.json
    image_data = data.get("image")
    
    if not image_data:
        print("No image found!")
        return jsonify({"error": "No image provided"}), 400
      
    print('received image')
    return image_data

@app.route('/GetTheme', methods=['POST'])
def getTheme():
    data = request.json
    theme_data = data.get('theme')
    print(f"Theme: {theme_data}")
    theme_context, theme_text, temperature = get_theme_prompt(theme_data)  # Call the Theme function
    print(f"ThemeContext: {theme_context}")
    print(f"ThemeText: {theme_text}")
    return jsonify({"theme": theme_data}), 200

@app.route('/generate-prompt', methods=['POST'])
def generate_prompt():
    try:
        # Start timing the request
        import time
        start_time = time.time()
        
        data = request.json
        image_data = data.get("image")
        theme_data = data.get('theme', 'Default')  # fetch the current theme from the request
        prompt_data = data.get('prompt', '')  # Additional user prompt

        print(f"Received prompt: {prompt_data}")
        print(f"Theme: {theme_data}")

        if not image_data:
            print("No image found!")
            return jsonify({"error": "No image provided"}), 400
        
        theme_context, theme_text, temperature = get_theme_prompt(theme_data)  # Call the Theme function

        print(f"ThemeContext: {theme_context}")
        print(f"ThemeText: {theme_text}")

        # Incorporate user prompt if provided
        final_prompt = theme_text
        if prompt_data:
            final_prompt = f"{theme_text}\n Additional requirements: {prompt_data}"
            print(f"Added user prompt to theme: {prompt_data}")

        print(f"Final prompt: {final_prompt}")

        # Process the image through PIL to ensure clean data
        try:
            if "," in image_data:
                image_base64 = image_data.split(",")[1]
            else:
                image_base64 = image_data
                
            # Generate description using GPT
            gpt_response = client.chat.completions.create(
                model="gpt-4o-mini",
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
                                "image_url": {"url": f"data:image/png;base64,{image_base64}"}
                            }
                        ]
                    }
                ],
                n=1,
                temperature=temperature,
            )
            
            description = gpt_response.choices[0].message.content
            print(f"Generated description: {description}")
            
            # Generate a title based on the description
            title = generate_title_from_description(description, theme_data)
            
            # Generate image using Stability AI
            stability_response = requests.post(
                stable_diffusion_api_url,
                headers={
                    "authorization": f"Bearer {stable_diffusion_apiKey}",
                    "accept": "image/*"
                },
                files={"none": ' '},
                data={
                    "prompt": description,
                    "output_format": "jpeg",
                    "style_preset": "photographic",
                    "steps": 40
                },
            )
            
            if stability_response.status_code != 200:
                logging.error(f"Error from Stability AI: {stability_response.text}")
                return jsonify({"error": "Failed to generate image"}), 500
            else:
                img_base64 = base64.b64encode(stability_response.content).decode("utf-8")
                
                # Calculate total processing time
                end_time = time.time()
                total_time = end_time - start_time
                
                return jsonify({
                    "image": img_base64,
                    "description": description,
                    "prompt": description[:100] + "..." if len(description) > 100 else description,
                    "title": title,
                    "latency": round(total_time, 3)  # Round to 3 decimal places (milliseconds)
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
    app.run(debug=True, port=5001, threaded=True)