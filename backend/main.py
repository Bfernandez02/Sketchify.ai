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

app = Flask(__name__)
openai.api_key = os.getenv("OPENAI_API_KEY")
client  = OpenAI()
CORS(app)

stable_diffusion_api_url = 'https://api.stability.ai/v2beta/stable-image/generate/ultra'
stable_diffusion_apiKey = os.getenv("STABILITY_API_KEY")
@app.route('/generate-prompt', methods =['POST'])
def generate_prompt():
    try:
        response  = client.chat.completions.create(
            model= "gpt-4o-mini",
            messages=[
                {"role":"system","content":"You are given a scenerio and your job is to explain the scene in as much detail as possible"},
                {"role":"user","content":"Bigfoot in a Mossy Green Forest"}
            ],
        )
        api_response  =  response.choices[0].message.content

        print(f"AI Response: {api_response}")

        # Generate image using stability AI

        # headers = {
        #     "authorization": f"Bearer {stable_diffusion_apiKey}",
        #     "accept": "image/*"
        # },
        # data = {
        #     "prompt": [{"text": api_response}],
        #     "cfg_scale": 7, 
        #     "output_format": "webp",
        #     "width": 1024,
        #     "height": 1024,
        #     "samples": 1,
        # }
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

            return jsonify({"message": "Image successfully generated and saved as 'generated_image.png'"}), 20
    except Exception as e:
        logging.error(f"Error: {e}")
      #  logging.error(f"Error from Stability AI: {stability_response.text}")
        return json.jsonify({"error": str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)