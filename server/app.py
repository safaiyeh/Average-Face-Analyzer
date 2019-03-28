from flask import Flask
from flask import request
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)


@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        f = request.files['the_file']
        f.save(os.path.join('/Users/safaiyeh/code/Average-Face-Analyzer/web', f.filename))
        # Add analyze code
    return 'image uploaded'


if __name__ == '__main__':
    app.run()
