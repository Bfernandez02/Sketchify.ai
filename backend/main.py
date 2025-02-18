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
            messages=[
                {"role": "system", "content": "Your job is to describe the sketch in as much detail as possible and present every single detail without losing any context."},
                {"role": "user", "content": [
                    {"type": "text", "text": "I want a detailed  description of this sketch, do not lose context and be specific to what you see. Do not include any response details like \"Description:\"."
                     },
                    {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{image_base64}"}}
                ]}
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
    app.run(debug=True)