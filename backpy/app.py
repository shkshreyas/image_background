# app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/process-image', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded.'}), 400

    file = request.files['image']

    if file and allowed_file(file.filename):
        image = Image.open(file.stream)
        # Here, you would add your image processing logic
        # For demonstration, let's just return the original image but could be modified
        byte_io = io.BytesIO()
        image.save(byte_io, format='PNG')
        byte_io.seek(0)
        
        return byte_io.read(), 200, {'Content-Type': 'image/png'}
    
    return jsonify({'error': 'Invalid file format.'}), 400

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))