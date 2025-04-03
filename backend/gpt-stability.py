import os
from flask import Flask,request,json,jsonify
import base64
from flask_cors import CORS
import logging
import requests
from openai import OpenAI
import openai
from dotenv import load_dotenv
load_dotenv()
from io import BytesIO
from themes import get_theme_prompt

app = Flask(__name__)
openai.api_key = os.getenv("OPENAI_API_KEY")
client  = OpenAI()
CORS(app)

stable_diffusion_api_url = 'https://api.stability.ai/v2beta/stable-image/generate/ultra'
stable_diffusion_apiKey = os.getenv("STABILITY_API_KEY")


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

@app.route('/get-image', methods = ['POST'])
def get_photo():     
    data = request.json
    image_data = data.get("image")
    
    if not image_data:
        print("No image found !")
        return jsonify({"error": "No image provided"}), 400
      
    print('recieved image')
    return image_data

@app.route('/GetTheme', methods =['POST'])
def getTheme():
    data = request.json
    theme_data = data.get('theme')
    print(f"Theme: {theme_data}")
    theme_context,theme_text = get_theme_prompt(theme_data) # Call the Theme function
    print(f"ThemeContext: {theme_context}")
    print(f"ThemeText: {theme_text}")
    return jsonify({"theme": theme_data}), 200

@app.route('/generate-prompt', methods =['POST'])
def generate_prompt():
    try:        
        data = request.json
        image_data = data.get("image")
        theme_data = data.get('theme') # fetch the current theme from the request

        if not image_data:
            print("No image found !")
            return jsonify({"error": "No image provided"}), 400
        
        theme_content,theme_text, temperature = get_theme_prompt(theme_data) # Call the Theme function

        print(f"ThemeContent: {theme_content}")
        print(f"ThemeText: {theme_text}")

        image_base64 = image_data.split(",")[1]

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages = [
                {
                    "role": "system",
                    "content": theme_content
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": theme_text
                        },
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:image/png;base64,{image_base64}"}
                        }
                    ]
                }
            ],
            n=1,
            temperature= temperature,
            )
        api_response  =  response.choices[0].message.content
        print(f"AI Response: {api_response}")
        
        stability_response = requests.post(
            stable_diffusion_api_url,
            headers={
                "authorization": f"Bearer {stable_diffusion_apiKey}",
                "accept": "image/*"
            },
            files={"none": ' '
                   
            },
            data={
                "prompt": api_response,
                "output_format": "jpeg",
                "style_preset": "photographic",
                "steps": 40
            },
        )
        if stability_response.status_code !=200:
            logging.error(f"Error from Stability AI: {stability_response.text}")
            return jsonify({"error": "Failed to generate image"}), 500
        else:
            with open("generated_image.jpeg","wb") as f:
                f.write(stability_response.content)
                img_base64 = base64.b64encode(stability_response.content).decode("utf-8")

            return jsonify({
                "image": img_base64,
                "Description":api_response
                }), 200
        
    except Exception as e:
        logging.error(f"Error: {e}")
        return json.jsonify({"error": str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True, port=5001,threaded=True)