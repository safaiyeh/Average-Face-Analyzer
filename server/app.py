from flask import Flask
from flask import request
from flask_cors import CORS
from flask import render_template
#from waitress import serve
import analyzer as a
import os


APP_ROOT = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(APP_ROOT, 'images\\')

app = Flask(__name__)
app.config['UPLOAD'] = UPLOAD_FOLDER
CORS(app)


@app.route('/')
def index():
    return '<h1>Hello, this is the Flask portion of the app<h1>'

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        f = request.files['the_file']
        
        destination = os.path.join(app.config['UPLOAD'], f.filename)
        print('Upload Folder: ' + destination)
        
        f.save(os.path.join(app.config['UPLOAD'], f.filename))
        # Add analyze code
        output = a.analyze(destination)
        
    return "output"


if __name__ == '__main__':
    app.run()
    #serve(app, host='0.0.0.0', port=9999)
