import os
from flask import Flask,request,json
import base64
from flask_cors import CORS
import logging
import requests
from openai import OpenAI


app = Flask(__name__)

if __name__ == '__main__':
    app.run(debug=True)