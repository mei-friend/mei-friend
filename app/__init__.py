from flask import Flask
from os import getenv
from authlib.integrations.flask_client import OAuth

env_path = getenv("STATIC_URL_PATH")
env_folder = getenv("STATIC_FOLDER")

app = Flask(__name__, static_url_path=env_path if env_path else None, 
        static_folder=env_folder if env_folder else None)
app.secret_key = getenv("FLASK_SECRET")

from app import routes


