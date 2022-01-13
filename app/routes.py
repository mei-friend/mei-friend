from flask import Flask, url_for, redirect, render_template, session
from dotenv import load_dotenv
from os import getenv
from authlib.integrations.flask_client import OAuth

from app import app

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
    if 'githubToken' in session:
        return render_template('index.html', 
                isLoggedIn = "true", # for Javascript, not Python...
                githubToken = session['githubToken'],
                userLogin = session['userLogin'],
                userName = session['userName'],
                userEmail = session['userEmail'])
    return render_template('index.html',
        isLoggedIn = False
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
    return redirect(url_for('index'))

@app.route("/authorize")
def authorize():
    token = github.authorize_access_token()
    resp = github.get('user', token=token)
    profile = resp.json()
    session['githubToken'] = token["access_token"]
    session['userLogin'] = profile["login"]
    session['userName'] = profile["name"]
    session['userEmail'] = profile["login"] + "@users.noreply.github.com"
    return redirect(url_for('index'))

@app.route("/help")
def show_help():
    return render_template('help.html')

if __name__ == '__main__':
    load_dotenv()
    app.run(debug=True, port=5000, host="0.0.0.0")
