from flask import Flask
from os import getenv
from authlib.integrations.flask_client import OAuth
import sys

env_path = getenv("STATIC_URL_PATH") or None
env_folder = getenv("STATIC_FOLDER") or None

print("env path: ", env_path)
print("env folder: ", env_folder)

if env_path and env_folder:
    app = Flask(__name__, static_url_path = env_path, static_folder = env_folder)
elif env_path or env_folder:
    sys.exit("Please supply NEITHER or BOTH of STATIC_URL_PATH and STATIC_FOLDER")
else:     
    app = Flask(__name__)
app.secret_key = getenv("FLASK_SECRET")

from app import routes


