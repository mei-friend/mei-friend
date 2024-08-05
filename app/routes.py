from flask import Flask, url_for, redirect, render_template, request, session, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from base64 import b64encode
import requests
from dotenv import load_dotenv
from os import getenv
from authlib.integrations.flask_client import OAuth
import mimetypes

from app import app

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["5 per second"]
)

mimetypes.add_type('application/javascript', '.js')

ALLOWED_DOMAINS = ['github.com'] # for CORS proxy

oauth = OAuth(app)
github = oauth.register(
    name='github',
    client_id=getenv("CLIENT_ID"),
    client_secret=getenv("SECRET_ID"),
    access_token_url='https://github.com/login/oauth/access_token',
    access_token_params=None,
    authorize_url='https://github.com/login/oauth/authorize',
    authorize_params=None,
    api_base_url='https://api.github.com/',
    client_kwargs={'scope': 'repo user'},
)


@app.route('/')
def index():
    haveGHConfig = getenv("CLIENT_ID");
    if 'githubToken' in session:
        return render_template('index.html', 
                isLoggedIn = "true", # for Javascript, not Python...
                githubToken = session['githubToken'],
                userLogin = session['userLogin'],
                userName = session['userName'] if session['userName'] else session['userLogin'],
                userEmail = session['userEmail'], 
                gitEnabled = haveGHConfig)
    return render_template('index.html',
        isLoggedIn = False,
        gitEnabled = haveGHConfig
    )

@app.route("/login")
def login():
    env_url = getenv("REDIRECT_URL")
    redirect_url = env_url if env_url else url_for("authorize", _external=True)
    # redirect_url = url_for("authorize", _external=True)
    return github.authorize_redirect(redirect_url)

@app.route("/logout")
def logout():
    session.clear()
    env_url = getenv("ROOT_URL")
    return redirect(env_url if env_url else url_for('index'))

@app.route("/authorize")
def authorize():
    token = github.authorize_access_token()
    resp = github.get('user', token=token)
    profile = resp.json()
    session['githubToken'] = token["access_token"]
    session['userLogin'] = profile["login"]
    session['userName'] = profile["name"]
    session['userEmail'] = profile["login"] + "@users.noreply.github.com"
    env_url = getenv("ROOT_URL")
    return redirect(env_url if env_url else url_for('index'))

@app.route("/help")
def show_help():
    return render_template('help.html')

def is_allowed_domain(url):
    from urllib.parse import urlparse
    domain = urlparse(url).netloc
    return domain in ALLOWED_DOMAINS

@app.route('/proxy/<path:url>', methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
@limiter.limit("5 per second")
def proxy(url):
    # decode the URL to handle special characters
    url = requests.utils.unquote(url)
    if not url:
        return jsonify({'error': 'Missing URL subpath'}), 400
    # default to https if no protocol is provided
    if not url.startswith('http'):
        url = 'https://' + url
    if not is_allowed_domain(url):
        return jsonify({'error': 'Domain not allowed'}), 400
    url+= '?' + request.query_string.decode()

    # Get the request method and headers
    method = request.method
    headers = {key: value for key, value in request.headers if key != 'Host'}
    headers["Origin"] = headers["Referer"].strip("/")
    headers["Sec-Fetch-Site"] = "cross-site"
    headers["TE"] = "trailers" 
    auth_str = session['userLogin'] + ':' + session['githubToken']
#    headers['Authorization'] = 'Bearer ' + b64encode(auth_str.encode()).decode()
#    headers['Authorization'] = 'Basic ' + b64encode(auth_str.encode()).decode()
#    headers['Authorization'] = 'Bearer ' + b64encode(session['githubToken'].encode()).decode()
#   headers['Authorization'] = 'token ' + session['githubToken']
#   headers["X-GitHub-Api-Version"] = "2022-11-28"

#   # Forward the request to the target URL
    print(f"Proxying {method} request to {url}")
    print(f"Headers: {headers}")
    print(f"Credentials: {auth_str}")
#   print(f"auth_str: {auth_str}")
    response = requests.request(method, url, headers=headers, data=request.get_data(), cookies=request.cookies)
    print(f"Response from {url}: {response.text}")

    # Prepare the response to return to the client
    excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
    headers = [(name, value) for name, value in response.raw.headers.items() if name.lower() not in excluded_headers]

    return (response.content, response.status_code, headers)

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

if __name__ == '__main__':
    load_dotenv()
    app.run(debug=True, port=5001, host="0.0.0.0")
