import requests
import os

# URL of the Flask application
UPLOAD_URL = "http://127.0.0.1:5000/upload"

# Path to the image file you want to upload
IMAGE_PATH = os.path.dirname(__file__) + "/image copy.png"

def upload_image(image_path):
    with open(image_path, 'rb') as image_file:
        # Prepare the files payload
        files = {'image': image_file}

        # Make the POST request to the Flask server
        response = requests.post(UPLOAD_URL, files=files)

        # Check the response
        if response.status_code == 200:
            print("Ingredients extracted:", response.json().get('ingredients'))
        else:
            print(f"Failed to upload image. Status code: {response.status_code}")
            print("Response:", response.text)

if __name__ == "__main__":
    upload_image(IMAGE_PATH)
