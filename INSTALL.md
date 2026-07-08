# Installation instructions

Here we describe how to set up your instance of mei-friend to run locally on your system, such as to test your own modifications of the code base.
If you simply want to try out mei-friend, please go to [https://mei-friend.mdw.ac.at](https://mei-friend.mdw.ac.at).

## To configure:

### If GitHub integration is required, set up GitHub OAuth application:
* Go to https://github.com/settings/developers
* Click on "New OAuth App"
* Enter application name = "mei-friend"
* Enter homepage = "https://iwk.mdw.ac.at"
* Enter callback URL = "http://localhost:4000/authorize"
* Click "Register application"
* Click "Generate new client secret" and log in if necessary
* Retain this page for configuration in the next steps:

### Set up mei-friend-online app
* `git clone --recursive git@github.com:mei-friend/mei-friend`
* `cd mei-friend`
* `cp env-template .env`
* If required, edit .env to add in CLIENT_ID and SECRET_ID from the GitHub OAuth application
* Add a random hard to guess string as FLASK_SECRET
* If required, add a REDIRECT_URL to override the flask url_for("authorize") route in deployment
* If required, add STATIC_URL_PATH and/or STATIC_FOLDER to override the Flask defaults in deployment
* For development mode, set FLASK_ENV to "development" => do not deploy in development mode!
* For deployment, *un*set FLASK_APP. This will cause wsgi.py to be used instead.
* To build CodeMirror (source cloned as submodule via --recursive flag earlier):
  - `cd app/static/CodeMirror/`
  - `npm install rollup`
  - `npm run build`
* Return to root mei-friend directory:
  - `cd ../../../`
* Run `python -m venv venv` (if your system python is not python 3, run `python3 -m venv venv`)
* Run `. venv/bin/activate` (for Windows, use ` . venv\Scripts\activate`). Your prompt should update to show (venv) at the start.
* Run `pip install -r requirements.txt`

### Server-side session storage
* mei-friend keeps login sessions (including GitHub OAuth tokens) server-side.
  Session files are written to `instance/sessions/` in the repository root
  (gitignored, never served, created automatically at startup with `0700`
  permissions).
* The process running the app (e.g. the gunicorn service user) therefore needs
  **write access to the `instance/` directory only** — not to the rest of the
  repository. For deployments where the code tree is kept read-only to the
  service user (recommended), pre-create the directory as an administrator:
  `mkdir -p <repo>/instance && chown <service-user> <repo>/instance` — the app
  then manages `instance/sessions/` within it. Write access to the repository
  root is only needed if the app must create `instance/` itself on first start.
* If the directory cannot be created, the app refuses to start, and prints a
  `Cannot create session directory` error — this is deliberate, so that a
  misconfiguration is noticed at deploy time rather than sessions silently
  landing somewhere volatile.
* To store sessions elsewhere (e.g. a dedicated service-only directory), set
  `SESSION_DIR` in `.env`. An explicitly provisioned directory is used with its
  existing permissions; keep it readable by the service user only, as session
  files contain access tokens.
* Sessions survive service restarts and deployments. Deleting
  `instance/sessions/` logs all users out (they simply log in again).

## Install and set up end-to-end testing with playwright
* Run `npm install` in the mei-friend root directory to install the required packages
* Go to tests directory:
  - `cd e2e`
  - `npx playwright install` to instruct playwright to download the required browser files
* Update your .env file to include
  - TEST_URL="http://localhost:5001"
  (Or, wherever you are running your local instance)
* Update your git config to run tests automatically before pushing to a public branch
  - `git config --local core.hooksPath .githooks/`
* Run the tests manually with playwright (from e2e directory):
  - `npx playwright test --retries=3 --config=../playwright.config.js --project=chromium`

## To run
* Ensure you are in the mei-friend repository's root directory
### Development mode:
* `. venv/bin/activate` (for Windows, use ` . venv\Scripts\activate`)
* `flask run`

### Production deployment:
* Use wsgi and gunicorn (instructions tbc)

### To update Python dependencies:
* The `cryptography` module requires rust, which may need updating
    - E.g., on Debian-based systems: `apt install rustc`
* Ensure current pip version: `pip install --upgrade pip`
* Run upgrade of dependencies: `pip install -r requirements.txt`
