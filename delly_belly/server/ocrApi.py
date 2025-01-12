from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import requests
import pytesseract
from PIL import Image
import re
import requests

def extract_items_from_receipt(image_data):
    """
    Extracts edible grocery items from a receipt image.
    
    Args:
        image_data (bytes): The image data in bytes.

    Returns:
        list: A list of extracted grocery items.
    """
    # Save image data to a temporary file
    with open('./delly_belly/server/uploads/image.png', 'wb') as temp_file:
        temp_file.write(image_data)
    
    # Use PIL to open the image
    image = Image.open('image.png')
    
    # Extract text using pytesseract
    extracted_text = pytesseract.image_to_string(image)

    return processed("\n".join(extracted_text.split()))

def processed(text):
    # Define the API URL and your API key (replace with your own API key)
    cohere_api_url = "https://api.cohere.ai/v1/generate"
    api_key = "qbhlyY09uPRoECCFVoolpLSOrOkssthkmkzsdNW1"  # Replace with your actual API key

    prompt = f"Extract a list of cooking ingredients from the following text and return them as a comma separated string and return nothing else:\n{text}"
    # Set up the payload for the API call
    payload = {
        "model": "command",  # You can choose a different model if needed
        "prompt": prompt,
        "max_tokens": 10,  # Adjust max tokens based on the length of the expected response
        "temperature": 0.7  # Adjust temperature for randomness in response
    }

    # Headers with the API key
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    # Make the POST request to Cohere's API
    response = requests.post(cohere_api_url, json=payload, headers=headers)

    # Check if the response is successful
    if response.status_code == 200:
        data = response.json()
        print(data)
        ingredients = data.get("text", "").strip()
        print("Extracted Ingredients:", ingredients)
    else:
        print(f"Error: {response.status_code}, {response.text}")


def fetch_recipes(items):
    """
    Fetch recipes based on a list of grocery items.
    
    Args:
        items (list): A list of grocery items (strings).
    
    Returns:
        list: A list of recipes with their details.
    """
    # Replace this with a real API endpoint and API key
    API_URL = "https://api.spoonacular.com/recipes/findByIngredients"
    API_KEY = "51b2b7dd06b5440e87581c395e519360"  # Get an API key from Spoonacular or a similar service

    # Join items into a comma-separated string
    ingredients = ','.join(items)

    # API request parameters
    params = {
        'ingredients': ingredients,
        'number': 10,  # Limit the number of recipes returned
        'ranking': 2,  # Focus on maximizing ingredient match
        'apiKey': API_KEY
    }

    # Make the API request
    response = requests.get(API_URL, params=params)

    if response.status_code == 200:
        recipes = response.json()
        # Simplify the response to return only the relevant details
        return [
            {
                'title': recipe['title'],
                'image': recipe['image'],
                'usedIngredients': [i['name'] for i in recipe['usedIngredients']],
                'missedIngredients': [i['name'] for i in recipe['missedIngredients']],
            }
            for recipe in recipes
        ]
    else:
        raise Exception(f"API error: {response.status_code} - {response.text}")
    

app = Flask(__name__)

UPLOAD_FOLDER = './uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_receipt():
    if 'receipt' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['receipt']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        try:
            with open(file_path, 'rb') as image_file:
                print("entered exception1")
                items = extract_items_from_receipt(image_file.read())
                print("entered exception2")

            os.remove(file_path)
            print("entered exception3")
            return jsonify({'items': items}), 200

        except Exception as e:
            os.remove(file_path)
            print("here I am", e)
            return jsonify({'error': f'Error extracting items: {str(e)}'}), 500

    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/recipes', methods=['POST'])
def get_recipes():
    data = request.json
    if not data or 'items' not in data:
        return jsonify({'error': 'No items provided'}), 400

    items = data['items']
    try:
        recipes = fetch_recipes(items)
        return jsonify({'recipes': recipes}), 200
    except Exception as e:
        return jsonify({'error': f'Error fetching recipes: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
    processed("fluour")
