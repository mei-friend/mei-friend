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
    default_limits=["20 per second"]
)

mimetypes.add_type('application/javascript', '.js')

ALLOWED_DOMAINS = ['github.com', 'gitlab.com'] # for CORS proxy

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

gitlab = oauth.register(
    name='gitlab',
    client_id=getenv("GITLAB_CLIENT_ID"),
    client_secret=getenv("GITLAB_SECRET_ID"),
    access_token_url='https://gitlab.com/oauth/token',
    access_token_params=None,
    authorize_url='https://gitlab.com/oauth/authorize',
    authorize_params=None,
    api_base_url='https://gitlab.com/api/v4/',
    client_kwargs={'scope': 'api read_user'},
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

@app.route('/login/<provider>')
def loginProvider(provider):
    redirect_uri = url_for('authorize', provider=provider, _external=True)
    if provider == 'github':
        return github.authorize_redirect(redirect_uri)
#    elif provider == 'gitlab':
#        return gitlab.authorize_redirect(redirect_uri)
#    elif provider == 'bitbucket':
#        return bitbucket.authorize_redirect(redirect_uri)
    else:
        return 'Unsupported provider', 400

def revoke_github_token(token):
    # Ask GitHub to invalidate the OAuth token so it cannot be reused after
    # logout. OAuth App tokens do not expire on their own, so without this a
    # leaked token stays valid indefinitely. Best-effort: never let a failure
    # here block the user from logging out.
    client_id = getenv("CLIENT_ID")
    client_secret = getenv("SECRET_ID")
    if not (token and client_id and client_secret):
        return
    try:
        requests.delete(
            'https://api.github.com/applications/{}/token'.format(client_id),
            auth=(client_id, client_secret),
            json={'access_token': token},
            headers={'Accept': 'application/vnd.github+json'},
            timeout=5,
        )
    except requests.RequestException as e:
        print("Could not revoke GitHub token on logout:", e)

@app.route("/logout")
def logout():
    # log out of every provider
    revoke_github_token(session.get('githubToken'))
    session.clear()
    env_url = getenv("ROOT_URL")
    return redirect(env_url if env_url else url_for('index'))

@app.route('/logout/<provider>')
def logoutProvider(provider):
    # log out of a specific provider
    if provider == 'github':
        revoke_github_token(session.get('githubToken'))
        session.pop('githubToken', None)
        session.pop('userLogin', None)
        session.pop('userName', None)
        session.pop('userEmail', None)
    elif provider == 'gitlab':
        session.pop('gitlab_user', None)
    elif provider == 'bitbucket':
        session.pop('bitbucket_user', None)
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

@app.route("/authorize/<provider>")
def authorizeProvider(provider):
    redirect_uri = url_for('authorize', provider=provider, _external=True)
    if provider == "github":
        return github.authorize_access_token(redirect_uri)
#    elif provider == "gitlab":
#        return gitlab.authorize_access_token(redirect_uri)
#    elif provider == "bitbucket":
#        return bitbucket.authorize_access_token(redirect_uri)
    else:
        return 'Unsupported provider', 400

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
    # Only logged-in users may use the proxy. All client-side git operations
    # that route through here are gated on a GitHub login, so this does not
    # restrict any anonymous flow; it prevents the endpoint being abused as an
    # open relay by arbitrary third-party sites.
    if 'githubToken' not in session:
        return jsonify({'error': 'Authentication required'}), 401
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

    # Get the request method and headers. Drop hop-by-hop and identity-bearing
    # headers: never forward our own session cookie upstream (it is readable and
    # carries the token), and let requests set its own Host.
    method = request.method
    excluded_request_headers = {'host', 'cookie'}
    headers = {key: value for key, value in request.headers
               if key.lower() not in excluded_request_headers}
    headers["Origin"] = request.headers.get("Referer", request.host_url).strip("/")
    headers["Sec-Fetch-Site"] = "cross-site"
    headers["TE"] = "trailers"

#   # Forward the request to the target URL (without forwarding client cookies)
    response = requests.request(method, url, headers=headers, data=request.get_data())

    # Prepare the response to return to the client
    excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection', 'www-authenticate']
    headers = [(name, value) for name, value in response.raw.headers.items() if name.lower() not in excluded_headers]

    return (response.content, response.status_code, headers)

if __name__ == '__main__':
    load_dotenv()
    app.run(debug=True, port=5001, host="0.0.0.0")
