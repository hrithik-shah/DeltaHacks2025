from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import requests
import pytesseract
from PIL import Image
import re
import requests
import cohere
import json

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
    image = Image.open('./delly_belly/server/uploads/image.png')
    
    # Extract text using pytesseract
    extracted_text = pytesseract.image_to_string(image)

    return processed("\n".join(extracted_text.split()))

def processed(text):
    # Define the API URL and your API key (replace with your actual API key)
    prompt = f"Generate a JSON array of strings of cooking ingredients extracted from the text below. Do not include non-consumable items. Replace any abbreviations with its English word adjacent. \n\n{text}"
    co = cohere.ClientV2(api_key="qbhlyY09uPRoECCFVoolpLSOrOkssthkmkzsdNW1")

    res = co.chat(
        model="command-r-plus-08-2024",
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        response_format={"type": "json_object",
                         "schema": {
                             "type": "object",
                             "properties": {
                                 "ingredients": {
                                     "type": "array",
                                 }
                             },
                         "required": ["ingredients"]
                        }}
    )

    return json.loads(res.message.content[0].text).get('ingredients')


def get_instructions(dishes):
    # Define the API URL and your API key (replace with your actual API key)
    prompt = f"Generate a JSON object that maps 'dish name' keys to 'recipe instructions' values given an array of strings of dish names from the text below. Use multiple lines for the instructions. Number the lines for the instructions. Generate the each instruction set as one string. \n\n{dishes}"
    co = cohere.ClientV2(api_key="qbhlyY09uPRoECCFVoolpLSOrOkssthkmkzsdNW1")
    res = co.chat(
        model="command-r-plus-08-2024",
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        response_format={"type": "json_object"}
    )
    return json.loads(res.message.content[0].text)


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
        simplified_recipies = [
            {
                'title': recipe['title'],
                'usedIngredients': [i['name'] for i in recipe['usedIngredients']],
                'missedIngredients': [i['name'] for i in recipe['missedIngredients']],
            }
            for recipe in recipes[0: max(5, len(recipes))]
        ]
        # Simplify the response to return only the relevant details
        return processed_recipes(simplified_recipies)
    else:
        raise Exception(f"API error: {response.status_code} - {response.text}")
    

def processed_recipes(recipes):
    instruction_map = get_instructions([recipe['title'] for recipe in recipes])
    for k, v in instruction_map.items():
        for recipe in recipes:
            if recipe['title'] == k:
                recipe['instructions'] = v
                break
    return recipes

app = Flask(__name__)
CORS(app) 

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
                items = extract_items_from_receipt(image_file.read())

            os.remove(file_path)
            return jsonify({'items': items}), 200

        except Exception as e:
            os.remove(file_path)
            return jsonify({'error': f'Error extracting items: {str(e)}'}), 500

    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/recipes', methods=['POST'])
def get_recipes():
    data = request.get_json()
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
    print(get_instructions(['Dosa', 'Pizza']))
