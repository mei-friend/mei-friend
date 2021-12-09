from flask import Flask
from os import getenv
from authlib.integrations.flask_client import OAuth

app = Flask(__name__)
app.secret_key = getenv("FLASK_SECRET")

from app import routes

