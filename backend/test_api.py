import requests
import base64
import json
import sys
import os

def test_api(url, image_path, theme="Default", prompt=""):
    """
    Test the Sketchify API with an image
    
    Args:
        url (str): The API URL
        image_path (str): Path to the image to send
        theme (str): Art theme to apply
        prompt (str): Additional prompt instructions
    """
    print(f"Testing API at: {url}")
    print(f"Using image: {image_path}")
    print(f"Theme: {theme}")
    
    # Read the image file
    with open(image_path, "rb") as image_file:
        image_bytes = image_file.read()
    
    # Convert to base64
    image_base64 = base64.b64encode(image_bytes).decode("utf-8")
    
    # Create payload
    payload = {
        "image": f"data:image/png;base64,{image_base64}",
        "theme": theme,
        "prompt": prompt
    }
    
    # Send request
    print("Sending request...")
    response = requests.post(
        f"{url}/generate-prompt", 
        json=payload,
        headers={"Content-Type": "application/json"}
    )
    
    # Check response
    if response.status_code == 200:
        data = response.json()
        print("Request successful!")
        print(f"Title: {data.get('title')}")
        print(f"Description: {data.get('description')}")
        
        # Save the response image
        if data.get("image"):
            output_path = "response_image.png"
            with open(output_path, "wb") as f:
                img_data = base64.b64decode(data["image"])
                f.write(img_data)
            print(f"Saved response image to: {output_path}")
    else:
        print(f"Request failed with status code: {response.status_code}")
        print(f"Response: {response.text}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python test_api.py <api_url> <image_path> [theme] [prompt]")
        sys.exit(1)
    
    url = sys.argv[1]
    image_path = sys.argv[2]
    theme = sys.argv[3] if len(sys.argv) > 3 else "Default"
    prompt = sys.argv[4] if len(sys.argv) > 4 else ""
    
    test_api(url, image_path, theme, prompt)