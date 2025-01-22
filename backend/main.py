import os
from flask import Flask,request,json
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
client  =OpenAI()
CORS(app)
@app.route('/generate-prompt', methods =['POST'])
def generate_prompt():

    try:
        response  = client.chat.completions.create(
            model= "gpt-4",
            messages=[
                {"role":"system","content":"You are a helpful assitant"},
                {"role":"user","content":"What is the meaning of Life?"}
            ]
        )
        api_response  =  response.choices[0].message.content

        print(f"AI Response: {api_response}")

        return json.jsonify({"response": api_response})
        
    except Exception as e:
        logging.error(f"Error: {e}")
        return json.jsonify({"error": str(e)}), 500

   
if __name__ == '__main__':
    app.run(debug=True)