import pytest
import base64
from PIL import Image
import io
import json
from app import app, create_transformation_prompt, all_in_one_gemini_request

@pytest.fixture
def client():
    """Create a test client for the Flask application"""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


# This Function is utilized to createa  simple image translated to a base 64 string
@pytest.fixture
def sample_image():
    """Create a sample test image"""
    img = Image.new('RGB', (100, 100), color='white')
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    img_byte_arr = img_byte_arr.getvalue()
    return base64.b64encode(img_byte_arr).decode('utf-8')



def test_home_endpoint(client):
    """Test home endpoint returns correct structure"""
    response = client.get('/')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert "message" in data
    assert "endpoints" in data
    assert data["message"] == "Welcome to Sketchify.ai Single-Call API"
    assert isinstance(data["endpoints"], list)


def test_test_endpoint(client):
    """Test the test endpoint functionality"""
    response = client.get('/test')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert "status" in data
    assert "service_account" in data
    assert "api_key" in data
    assert data["status"] == "connected"


# Unit Test to ensure the all_in_one_gemini_request function is working as expected
def test_create_transformation_prompt():
    """Test transformation prompt creation"""
    prompt = create_transformation_prompt(
        theme_name="Minimalism",
        theme_context="Clean design focus",
        theme_prompt="Focus on simplicity",
        user_prompt="Make it modern"
    )
    assert isinstance(prompt, str)
    assert "Minimalism" in prompt
    assert "modern" in prompt
    assert "simplicity" in prompt.lower()

# Unit test in which there is no base64 image string in the JSON File
def test_generate_prompt_no_image(client):
    """Test generate-prompt endpoint with missing image"""
    response = client.post('/generate-prompt', json={
        "theme": "Minimalism",
        "prompt": "test prompt"
    })
    assert response.status_code == 400
    data = json.loads(response.data)
    assert "error" in data

# Unit test for invalid base64 string
def test_generate_prompt_invalid_base64(client):
    """Test generate-prompt endpoint with invalid base64"""
    response = client.post('/generate-prompt', json={
        "image": "gwngjrggnj", # Invalid base64 string
        "theme": "Minimalism",
        "prompt": "test prompt" # Adiditional prompt
    })
    assert response.status_code != 200
    data = json.loads(response.data)
    assert "error" in data

# Test Case for valid request with image, theme, and prompt
@pytest.mark.integration
def test_generate_prompt_valid_request(client, sample_image):
    """Test generate-prompt endpoint with valid data"""
    response = client.post('/generate-prompt', json={
        "image": f"data:image/png;base64,{sample_image}",
        "theme": "Minimalism",
        "prompt": "test prompt",
        "complexity": "standard"
    })
    assert response.status_code == 200
    if response.status_code == 200:
        data = json.loads(response.data)
        assert "image" in data
        assert "title" in data
        assert "description" in data
        assert "prompt" in data
    else:
        assert response.status_code in [401, 403, 500]