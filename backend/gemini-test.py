import os
import time
import base64
import requests
import json
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import threading
from PIL import Image
from io import BytesIO

# Flask app setup
app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("GeminiTestProxy")

# Constants
OUTPUT_DIR = "test_output"
ORIGINAL_IMPL_URL = "http://localhost:5002/generate-prompt"  # First implementation 
SINGLE_PASS_URL = "http://localhost:5003/generate-prompt"    # Second implementation

# Ensure output directory exists
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)
    logger.info(f"Created output directory: {OUTPUT_DIR}")

def save_image(base64_img, filename):
    """Save a base64 encoded image to file"""
    try:
        img_data = base64.b64decode(base64_img)
        img = Image.open(BytesIO(img_data))
        img.save(filename)
        logger.info(f"Saved image to {filename}")
        return True
    except Exception as e:
        logger.error(f"Error saving image {filename}: {e}")
        return False

def test_implementation(url, payload, test_name, test_id):
    """Test a single implementation and return results"""
    logger.info(f"Testing {test_name}...")
    
    start_time = time.time()
    try:
        response = requests.post(url, json=payload, timeout=60)
        end_time = time.time()
        
        if response.status_code != 200:
            logger.error(f"{test_name} failed with status code {response.status_code}: {response.text}")
            return {
                "success": False,
                "latency": end_time - start_time,
                "error": f"HTTP {response.status_code}: {response.text}"
            }
        
        response_data = response.json()
        
        # Save the generated image
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        image_filename = f"{OUTPUT_DIR}/{test_id}_{test_name.replace(' ', '_')}_{timestamp}.png"
        
        if "image" in response_data:
            save_image(response_data["image"], image_filename)
        else:
            logger.error(f"No image in response from {test_name}")
        
        return {
            "success": True,
            "latency": end_time - start_time,
            "response": response_data,
            "image_path": image_filename if "image" in response_data else None
        }
    except Exception as e:
        end_time = time.time()
        logger.error(f"Error testing {test_name}: {e}")
        return {
            "success": False,
            "latency": end_time - start_time,
            "error": str(e)
        }

def run_tests_async(payload, test_id):
    """Run both tests asynchronously and return results when both complete"""
    results = {
        "original": None,
        "single_pass": None
    }
    
    def test_original():
        results["original"] = test_implementation(
            ORIGINAL_IMPL_URL, payload, "Original", test_id)
    
    def test_single_pass():
        results["single_pass"] = test_implementation(
            SINGLE_PASS_URL, payload, "SinglePass", test_id)
    
    # Start both threads
    thread1 = threading.Thread(target=test_original)
    thread2 = threading.Thread(target=test_single_pass)
    
    thread1.start()
    thread2.start()
    
    # Wait for both to complete
    thread1.join()
    thread2.join()
    
    return results

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "message": "Welcome to Gemini Testing Proxy",
        "endpoints": [
            {"path": "/generate-prompt", "method": "POST", "description": "Test both implementations and return the faster result"}
        ]
    })

@app.route('/generate-prompt', methods=['POST'])
def generate_prompt():
    """
    Test endpoint that calls both implementations and returns the results
    """
    try:
        # Generate a test ID
        test_id = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Get request data
        data = request.json
        logger.info(f"Received request with theme: {data.get('theme', 'Default')}")
        
        # Run tests for both implementations
        results = run_tests_async(data, test_id)
        
        # Log comparison results
        logger.info("\n=== TEST RESULTS ===")
        
        if results["original"]["success"]:
            logger.info(f"Original Implementation: Success - {results['original']['latency']:.2f}s")
        else:
            logger.info(f"Original Implementation: Failed - {results['original'].get('error', 'Unknown error')}")
            
        if results["single_pass"]["success"]:
            logger.info(f"Single Pass Implementation: Success - {results['single_pass']['latency']:.2f}s")
        else:
            logger.info(f"Single Pass Implementation: Failed - {results['single_pass'].get('error', 'Unknown error')}")
        
        # Compare latency if both succeeded
        if results["original"]["success"] and results["single_pass"]["success"]:
            latency_diff = results["original"]["latency"] - results["single_pass"]["latency"]
            improvement = (latency_diff / results["original"]["latency"]) * 100
            
            logger.info("=== PERFORMANCE SUMMARY ===")
            logger.info(f"Original: {results['original']['latency']:.2f}s")
            logger.info(f"Single Pass: {results['single_pass']['latency']:.2f}s")
            
            if improvement > 0:
                logger.info(f"The Single Pass implementation is {abs(improvement):.2f}% faster")
                # Return the faster implementation's result
                return jsonify({
                    **results["single_pass"]["response"],
                    "metadata": {
                        "original_latency": results["original"]["latency"],
                        "single_pass_latency": results["single_pass"]["latency"],
                        "improvement_percent": improvement,
                        "test_id": test_id
                    }
                })
            else:
                logger.info(f"The Original implementation is {abs(improvement):.2f}% faster")
                # Return the faster implementation's result
                return jsonify({
                    **results["original"]["response"],
                    "metadata": {
                        "original_latency": results["original"]["latency"],
                        "single_pass_latency": results["single_pass"]["latency"],
                        "improvement_percent": improvement,
                        "test_id": test_id
                    }
                })
        
        # If only one succeeded, return that one
        if results["original"]["success"]:
            return jsonify({
                **results["original"]["response"],
                "metadata": {
                    "original_latency": results["original"]["latency"],
                    "single_pass_success": False,
                    "test_id": test_id
                }
            })
        
        if results["single_pass"]["success"]:
            return jsonify({
                **results["single_pass"]["response"],
                "metadata": {
                    "original_success": False,
                    "single_pass_latency": results["single_pass"]["latency"],
                    "test_id": test_id
                }
            })
        
        # If both failed, return error
        return jsonify({
            "error": "Both implementations failed",
            "original_error": results["original"].get("error"),
            "single_pass_error": results["single_pass"].get("error"),
            "test_id": test_id
        }), 500
            
    except Exception as e:
        logger.error(f"Error in test proxy: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    logger.info("Starting Gemini Testing Proxy")
    logger.info(f"Testing Original Implementation at: {ORIGINAL_IMPL_URL}")
    logger.info(f"Testing Single-Pass Implementation at: {SINGLE_PASS_URL}")
    logger.info("Saving images to: " + os.path.abspath(OUTPUT_DIR))
    
    app.run(debug=True, port=5001, threaded=True)