from flask import Flask, url_for, redirect, render_template
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
@app.route('/index')
def index():
    return render_template('index.html',
            isLoggedIn = False
            )

@app.route("/login")
def login():
    print(getenv("CLIENT_ID"))
    redirect_url = url_for("authorize", _external=True)
    return github.authorize_redirect(redirect_url)

@app.route("/authorize")
def authorize():
    token = github.authorize_access_token()
    resp = github.get('user', token=token)
    profile = resp.json()
    print("Token: ", token);
    print("Profile: ", profile);
    # do something with the token and profile
    return render_template('index.html',
            isLoggedIn = True,
            githubToken = token["access_token"],
            userLogin = profile["login"],
            userName = profile["name"],
            userEmail = profile["login"] + "@users.noreply.github.com"
            )

if __name__ == '__main__':
    load_dotenv()
    app.run(debug=True, port=5000, host="0.0.0.0")
