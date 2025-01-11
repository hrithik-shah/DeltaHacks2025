from flask import Flask, request, jsonify
from flask_cors import CORS
import pytesseract
from PIL import Image
import requests

app = Flask(__name__)
CORS(app)

def extract_text(image_path):
    # Use Tesseract OCR to extract text from an image
    image = Image.open(image_path)
    return pytesseract.image_to_string(image).splitlines()

def get_recipes(ingredients):
    api_key = "YOUR_SPOONACULAR_API_KEY"
    url = f"https://api.spoonacular.com/recipes/findByIngredients?ingredients={','.join(ingredients)}&apiKey={api_key}"
    response = requests.get(url)
    return response.json()

@app.route('/upload', methods=['POST'])
def upload_image():
    image = request.files.get('image')
    if not image:
        return jsonify({'error': 'No image provided'}), 400

    # Save image and extract text
    image_path = f"./uploads/{image.filename}"
    image.save(image_path)
    ingredients = extract_text(image_path)

    return jsonify({'ingredients': ingredients})

@app.route('/recipes', methods=['POST'])
def fetch_recipes():
    data = request.json
    ingredients = data.get('ingredients', [])
    recipes = get_recipes(ingredients)

    return jsonify({'recipes': recipes})

if __name__ == '__main__':
    app.run(debug=True)
