from flask import Flask
from os import getenv, path, makedirs, chmod
from authlib.integrations.flask_client import OAuth
from flask_session import Session
from cachelib.file import FileSystemCache
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

# Server-side sessions: session data (including the GitHub OAuth token) is kept
# on the server; the browser only holds an opaque session ID. With Flask's
# default client-side sessions the cookie itself contains the token in
# base64-readable (signed, but not encrypted) form.
# The filesystem cache is shared between gunicorn workers on the same host and
# lives in the (gitignored, never-served) Flask instance folder by default, so
# sessions survive restarts and deployments without external setup. Set
# SESSION_DIR to override. No fallback on failure: refusing to start is better
# than silently landing somewhere volatile and losing all sessions later.
session_dir = getenv("SESSION_DIR")
if not session_dir:
    session_dir = path.join(app.instance_path, 'sessions')
try:
    makedirs(session_dir, mode=0o700, exist_ok=True)
    if not getenv("SESSION_DIR"):
        # session files contain OAuth tokens: keep the default directory
        # private to the service user (an explicit SESSION_DIR is presumed
        # provisioned with intentional permissions, so leave those alone)
        chmod(session_dir, 0o700)
except OSError as e:
    sys.exit("Cannot create session directory {}: {}".format(session_dir, e))
app.config['SESSION_TYPE'] = 'cachelib'
app.config['SESSION_CACHELIB'] = FileSystemCache(
    cache_dir = session_dir,
    threshold = 1000,
)
# Session cookie hygiene. Secure requires HTTPS, so switch it off for local
# development by setting FLASK_ENV=development.
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = getenv("FLASK_ENV") != 'development'
Session(app)

from app import routes
