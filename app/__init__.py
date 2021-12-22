from flask import Flask
from os import getenv
from authlib.integrations.flask_client import OAuth

app = Flask(__name__, static_url_path="/mei-friend/static", static_folder='static')
app.secret_key = getenv("FLASK_SECRET")

from app import routes


