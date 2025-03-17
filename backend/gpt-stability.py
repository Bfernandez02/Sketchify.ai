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

@app.route('/generate-prompt', methods =['POST'])
def generate_prompt():
    try:        
        data = request.json
        image_data = data.get("image")

        if not image_data:
            print("No image found !")
            return jsonify({"error": "No image provided"}), 400
        
        image_base64 = image_data.split(",")[1]

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages = [
                {
                    "role": "system",
                    "content": (
                        "You are an expert visual descriptor tasked with analyzing sketches for an AI image generation pipeline. "
                        "Your job is to describe the sketch in vivid, precise detail, capturing every visible element—shapes, lines, textures, objects, and composition—without losing context. "
                        "Focus on what is explicitly present, avoiding assumptions or embellishments beyond the sketch itself. "
                        "Structure the description as a concise, natural paragraph optimized for an image generation model like Stable Diffusion, using evocative yet specific language."
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
                            "image_url": {"url": f"data:image/png;base64,{image_base64}"}
                        }
                    ]
                }
            ] 
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
                "output_format": "jpeg"
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