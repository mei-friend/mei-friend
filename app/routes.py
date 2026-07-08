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

ALLOWED_DOMAINS = ['github.com', 'api.github.com', 'gitlab.com'] # for CORS proxy
# domains for which the proxy attaches the user's GitHub OAuth token server-side
GITHUB_AUTH_DOMAINS = ['github.com', 'api.github.com']

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
        # n.b.: the OAuth token itself stays server-side; authenticated GitHub
        # traffic goes through /proxy, which attaches it from the session
        return render_template('index.html',
                isLoggedIn = "true", # for Javascript, not Python...
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
        resp = requests.delete(
            'https://api.github.com/applications/{}/token'.format(client_id),
            auth=(client_id, client_secret),
            json={'access_token': token},
            headers={'Accept': 'application/vnd.github+json'},
            timeout=5,
        )
        # 204: revoked; 404: token was already invalid (or wrong app credentials)
        print("GitHub token revocation on logout: HTTP", resp.status_code)
    except requests.RequestException as e:
        print("Could not revoke GitHub token on logout:", e)

def revoke_github_grant(token):
    # Revoke the app's entire authorization grant for this user, which
    # invalidates ALL outstanding tokens for the user/app combination at once.
    # Used as a one-time migration to clean up tokens issued before the
    # server-side token-custody hardening, which never expire on their own.
    client_id = getenv("CLIENT_ID")
    client_secret = getenv("SECRET_ID")
    if not (token and client_id and client_secret):
        return False
    try:
        resp = requests.delete(
            'https://api.github.com/applications/{}/grant'.format(client_id),
            auth=(client_id, client_secret),
            json={'access_token': token},
            headers={'Accept': 'application/vnd.github+json'},
            timeout=5,
        )
        # 204: grant (and all its tokens) revoked
        print("GitHub grant reset (one-time token cleanup): HTTP", resp.status_code)
        return resp.status_code == 204
    except requests.RequestException as e:
        print("Could not reset GitHub grant:", e)
        return False

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

    # One-time migration per browser and account: revoke the whole
    # authorization grant so that tokens issued before the server-side
    # token-custody hardening (which never expire) are all invalidated.
    # Deleting the grant also kills the token just obtained, so we re-enter
    # the authorize flow; as the browser is still logged in to GitHub, the
    # user sees a single "Authorize" click. The session flag guards against
    # loops; the cookie (set below, after the second pass) marks completion.
    reset_cookie = 'mfGrantReset-' + profile["login"]
    if not request.cookies.get(reset_cookie) and not session.get('githubGrantResetDone'):
        if revoke_github_grant(token["access_token"]):
            session['githubGrantResetDone'] = True
            redirect_url = getenv("REDIRECT_URL") or url_for("authorize", _external=True)
            return github.authorize_redirect(redirect_url)
        # reset failed: continue with a normal login and retry on the next one

    session['githubToken'] = token["access_token"]
    session['userLogin'] = profile["login"]
    session['userName'] = profile["name"]
    session['userEmail'] = profile["login"] + "@users.noreply.github.com"
    env_url = getenv("ROOT_URL")
    response = redirect(env_url if env_url else url_for('index'))
    if session.pop('githubGrantResetDone', None):
        # migration completed for this account in this browser
        response.set_cookie(reset_cookie, '1', max_age=60 * 60 * 24 * 730,
                            secure=app.config.get('SESSION_COOKIE_SECURE', True),
                            httponly=True, samesite='Lax')
    return response

@app.route("/authorize/<provider>")
def authorizeProvider(provider):
    # Stub for future multi-provider support (gitlab, codeberg/forgejo, ...).
    # SECURITY NOTE for the implementer: mirror authorize() above -- exchange
    # the code server-side, store the token ONLY in the server-side session,
    # and redirect. Never return the token response to the browser (an earlier
    # version of this stub echoed authorize_access_token() to the client).
    return 'Unsupported provider', 501

@app.route("/help")
def show_help():
    return render_template('help.html')

def get_domain(url):
    from urllib.parse import urlparse
    return urlparse(url).netloc

def is_allowed_domain(url):
    return get_domain(url) in ALLOWED_DOMAINS

@app.route('/proxy/<path:url>', methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
# All authenticated GitHub traffic (API + git smart-HTTP) flows through here,
# so a page load or Actions polling legitimately bursts well beyond 5/s.
# Key by user login where available so users behind a shared institutional
# NAT don't throttle each other.
@limiter.limit("30 per second", key_func=lambda: session.get('userLogin') or get_remote_address())
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
    if request.query_string:
        url += '?' + request.query_string.decode()

    # Get the request method and headers. Drop hop-by-hop and identity-bearing
    # headers: never forward our own session cookie upstream, let requests set
    # its own Host, and ignore any client-supplied Authorization -- credentials
    # are attached server-side from the session so that the OAuth token never
    # needs to be present in the browser.
    method = request.method
    excluded_request_headers = {'host', 'cookie', 'authorization'}
    headers = {key: value for key, value in request.headers
               if key.lower() not in excluded_request_headers}
    headers["Origin"] = request.headers.get("Referer", request.host_url).strip("/")
    headers["Sec-Fetch-Site"] = "cross-site"
    headers["TE"] = "trailers"
    if get_domain(url) in GITHUB_AUTH_DOMAINS:
        if url.startswith('https://api.github.com/'):
            # GitHub REST API
            headers['Authorization'] = 'token ' + session['githubToken']
        else:
            # git smart-HTTP (clone/fetch/push): HTTP Basic, token as password
            auth_str = session.get('userLogin', '') + ':' + session['githubToken']
            headers['Authorization'] = 'Basic ' + b64encode(auth_str.encode()).decode()

#   # Forward the request to the target URL (without forwarding client cookies).
    # Timeout protects gunicorn workers from being parked indefinitely by a
    # hung upstream connection: 10s to connect, 60s between reads (a flowing
    # transfer, e.g. a clone pack, resets the read timer with every chunk).
    try:
        response = requests.request(method, url, headers=headers, data=request.get_data(), timeout=(10, 60))
    except requests.Timeout:
        return jsonify({'error': 'Upstream request timed out'}), 504

    # Prepare the response to return to the client. 'date' and 'server' must
    # not be passed through: our own HTTP layer (Werkzeug/gunicorn) adds its
    # own, and duplicate Date headers are joined by browsers into a string
    # that parses as Invalid Date, breaking date-based client logic.
    excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection',
                        'www-authenticate', 'date', 'server']
    headers = [(name, value) for name, value in response.raw.headers.items() if name.lower() not in excluded_headers]

    return (response.content, response.status_code, headers)

@app.after_request
def add_security_headers(response):
    # Report-only CSP: logs violations to the browser console without blocking
    # anything. Once observed clean in production, tighten and switch to an
    # enforcing Content-Security-Policy header.
    # - verovio.org: selectable Verovio toolkit versions (importScripts in worker)
    # - matomo.mdw.ac.at: usage statistics (matomo.js; tracking calls are
    #   covered by connect-src/img-src)
    # - connect-src/img-src *: open-URL, Solid pods, facsimile images, soundfonts
    # - unsafe-inline/unsafe-eval: inline bootstrap script in index.html; wasm
    if response.mimetype == 'text/html':
        response.headers['Content-Security-Policy-Report-Only'] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://www.verovio.org https://matomo.mdw.ac.at; "
            "worker-src 'self' blob:; "
            "connect-src *; "
            "img-src * data: blob:; "
            "media-src * data: blob:; "
            "style-src 'self' 'unsafe-inline'; "
            "font-src 'self' data:; "
            "object-src 'none'; "
            "base-uri 'self'; "
            "frame-ancestors 'self'"
        )
    return response

if __name__ == '__main__':
    load_dotenv()
    app.run(debug=True, port=5001, host="0.0.0.0")
