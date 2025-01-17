export default class GitCloudClient {
  constructor(conf) {
    console.log('GitCloudClient constructor', conf);
    if (typeof userLogin === 'undefined') {
      console.warn('User is not logged in to a git provider');
      return;
    }
    this.gm = conf.gm;
    this.token = conf.token;
    this.provider = conf.provider; // e.g. 'github'
    this.providerType = conf.providerType; // e.g. 'github'
    if (!(this.token && this.provider && this.providerType)) {
      throw new Error('Missing required configuration');
    }
    // Provider-specific configuration
    switch (this.providerType) {
      case 'github':
        this.apiHeaders = {
          Authorization: `token ${conf.token}`,
          Accept: 'application/vnd.github.v3+json',
        };
        this.actionsHeaders = new Headers({
          // FIXME needs to be adjusted for other providers
          // Particularly, note the current explicit GitHub assumption in userLogin (passed from flask)
          Authorization: 'Basic ' + btoa(userLogin + ':' + this.token),
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        });
        this.orgsUrl = `https://api.github.com/user/memberships/orgs`;
        this.reposUrl = `https://api.github.com/user/repos`;
        break;
      case 'gitlab':
        this.apiHeaders = {
          Authorization: `Bearer ${conf.token}`,
          Accept: 'application/json',
        };
        this.orgsUrl = `https://gitlab.com/api/v4/groups`;
        this.reposUrl = `https://gitlab.com/api/v4/projects`;
        break;
      case 'bitbucket':
        this.apiHeaders = {
          Authorization: `Bearer ${conf.token}`,
          Accept: 'application/json',
        };
        this.orgsUrl = `https://api.bitbucket.org/2.0/teams`;
        this.reposUrl = `https://api.bitbucket.org/2.0/repositories`;
        break;
      case 'codeberg':
        this.apiHeaders = {
          Authorization: `Bearer ${conf.token}`,
          Accept: 'application/json',
        };
        this.orgsUrl = `https://codeberg.org/api/v1/user/orgs`;
        this.reposUrl = `https://codeberg.org/api/v1/user/repos`;
        break;
      default:
        throw new Error('Unknown provider');
    }
  }

  async getOrgs() {
    // fetch all organizations the user belongs to from the cloud provider
    return fetch(this.orgsUrl, {
      method: 'GET',
      headers: this.apiHeaders,
    }).then((res) => res.json());
  }

  async getSpecifiedUserOrgRepos(userOrg, per_page = 30, page = 1) {
    let reposUrl;
    switch (this.providerType) {
      case 'github':
        reposUrl = `https://api.github.com/users/${userOrg}/repos?per_page=${per_page}&page=${page}`;
        break;
      case 'gitlab':
        reposUrl = `https://gitlab.com/api/v4/groups/${userOrg}/projects?per_page=${per_page}&page=${page}`;
        break;
      case 'bitbucket':
        reposUrl = `https://api.bitbucket.org/2.0/repositories/${userOrg}?pagelen=${per_page}&page=${page}`;
        break;
      case 'codeberg':
        reposUrl = `https://codeberg.org/api/v1/orgs/${userOrg}/repos?per_page=${per_page}&page=${page}`;
        break;
      default:
        throw new Error('Unknown provider');
    }
    return fetch(reposUrl, {
      method: 'GET',
      headers: this.apiHeaders,
    }).then((res) => res.json());
  }

  async getRepos(per_page = 30, page = 1) {
    const reposUrl = `https://api.github.com/user/repos?per_page=${per_page}&page=${page}`;
    return fetch(reposUrl, {
      method: 'GET',
      headers: this.apiHeaders,
    }).then((res) => res.json());
  }

  async getRepoSize(repo) {
    const sizeUrl = `https://api.github.com/repos/${repo}`;
    let size = await fetch(sizeUrl, {
      method: 'GET',
      headers: this.apiHeaders,
    }).then((res) => res.json());
    return size.size;
  }

  async getBranches(per_page = 30, page = 1, repo = this.repo) {
    // fetch all branches of the current repository from the cloud provider
    const branchesUrl = `https://api.github.com/repos/${repo}/branches?per_page=${per_page}&page=${page}`;
    return fetch(branchesUrl, {
      method: 'GET',
      headers: this.apiHeaders,
    }).then((res) => res.json());
  }

  async getCommits(repo, branch) {
    // fetch all commits of the current repository and branch from the cloud provider
    // use appropriate API endpoint based on the provider
    // TODO check this is not totally broken, non-github providers imagined by copilot

    // to circumvent GitHub API caching, add a cache buster to the URL
    let cache_buster = Math.random();
    // this is a hack to get around the GitHub API caching (URL is unique every time)
    switch (this.providerType) {
      case 'github':
        return fetch(`https://api.github.com/repos/${repo}/commits?sha=${branch}&cache_buster=${cache_buster}`, {
          method: 'GET',
          headers: this.apiHeaders,
        }).then((res) => res.json());
      case 'gitlab':
        return fetch(`https://gitlab.com/api/v4/projects/${repo}/repository/commits?ref_name=${branch}`, {
          method: 'GET',
          headers: this.apiHeaders,
        }).then((res) => res.json());
      case 'bitbucket':
        return fetch(`https://api.bitbucket.org/2.0/repositories/${repo}/commits?branch=${branch}`, {
          method: 'GET',
          headers: this.apiHeaders,
        }).then((res) => res.json());
      case 'codeberg':
        return fetch(`https://codeberg.org/api/v1/repos/${repo}/commits?ref=${branch}`, {
          method: 'GET',
          headers: this.apiHeaders,
        }).then((res) => res.json());
      default:
        throw new Error('Unknown provider');
    }
  }

  async getFiles(repo, branch, path) {
    // fetch all files of the current repository and branch from the cloud provider
    // use appropriate API endpoint based on the provider

    // first prepare the path:
    // remove trailing slash from path
    if (path.endsWith('/')) {
      path = path.slice(0, -1);
    }
    // encode the path
    path = encodeURIComponent(path);

    switch (this.providerType) {
      case 'github':
        // remove trailng slash from path
        return fetch(`https://api.github.com/repos/${repo}/contents${path}?ref=${branch}`, {
          method: 'GET',
          headers: this.apiHeaders,
        }).then((res) => res.json());
      case 'gitlab':
        return fetch(`https://gitlab.com/api/v4/projects/${repo}/repository/tree?ref=${branch}&path=${path}`, {
          method: 'GET',
          headers: this.apiHeaders,
        }).then((res) => res.json());
      case 'bitbucket':
        return fetch(`https://api.bitbucket.org/2.0/repositories/${repo}/src/${branch}${path}`, {
          method: 'GET',
          headers: this.apiHeaders,
        }).then((res) => res.json());
      case 'codeberg':
        return fetch(`https://codeberg.org/api/v1/repos/${repo}/contents${path}?ref=${branch}`, {
          method: 'GET',
          headers: this.apiHeaders,
        }).then((res) => res.json());
      default:
        throw new Error('Unknown provider');
    }
  }

  async getContents(repo, branch, path) {
    // fetch the content of a file from the cloud provider
    console.log('getContents');
  }

  async getAuthor() {
    if (this.author) {
      // return the cached author object if it exists
      return this.author;
    }
    switch (this.providerType) {
      case 'github':
        // fetch the user's name and email from the GitHub API
        return fetch('https://api.github.com/user', {
          method: 'GET',
          headers: this.apiHeaders,
        })
          .then((res) => res.json())
          .then((data) => this.setAuthor(data));
      case 'gitlab':
        // fetch the user's name and email from the GitLab API
        return fetch('https://gitlab.com/api/v4/user', {
          method: 'GET',
          headers: this.apiHeaders,
        })
          .then((res) => res.json())
          .then((data) => this.setAuthor(data));
      case 'bitbucket':
        // fetch the user's name and email from the Bitbucket API
        return fetch('https://api.bitbucket.org/2.0/user', {
          method: 'GET',
          headers: this.apiHeaders,
        })
          .then((res) => res.json())
          .then((data) => this.setAuthor(data));
      case 'codeberg':
        // fetch the user's name and email from the Codeberg API
        return fetch('https://codeberg.org/api/v1/user', {
          method: 'GET',
          headers: this.apiHeaders,
        })
          .then((res) => res.json())
          .then((data) => this.setAuthor(data));
      default:
        throw new Error('Unknown provider');
    }
  }

  setAuthor(user) {
    let author = {};
    // set the author object to the provided object
    author.name = user.name || user.login;
    author.username = user.login;
    author.email = user.email || '';
    if (!author.email && this.providerType === 'github') {
      author.email = author.username + '@users.noreply.github.com';
    }
    this.author = author;
    return author;
  }

  getCloneURL() {
    // return the clone URL of the current repository
    // based on the current repo (contains the userOrg and repoName)
    // ensure that the URL matches the current provider
    // TODO check this is not totally broken
    switch (this.providerType) {
      case 'github':
        return `https://github.com/${this.gm.repo}`;
      case 'gitlab':
        return `https://${this.provider}/gitlab/${this.gm.repo}`;
      case 'bitbucket':
        return `https://${this.provider}/bitbucket/${this.gm.repo}`;
      case 'codeberg':
        return `https://${this.provider}/codeberg/${this.gm.repo}`;
      default:
        throw new Error('Unknown provider');
    }
  }

  getRepoFromCloneURL(cloneURL = this.getCloneURL()) {
    // return the repo name from the clone URL
    // based on the current provider
    // TODO check this is not totally broken
    switch (this.providerType) {
      case 'github':
        return cloneURL.replace('https://github.com/', '');
      case 'gitlab':
        return cloneURL.replace(`https://${this.provider}/gitlab/`, '');
      case 'bitbucket':
        return cloneURL.replace(`https://${this.provider}/bitbucket/`, '');
      case 'codeberg':
        return cloneURL.replace(`https://${this.provider}/codeberg/`, '');
      default:
        throw new Error('Unknown provider');
    }
  }

  getRawURL(repo = this.gm.repo) {
    // return the raw URL of the current repository
    // based on the current repo (contains the userOrg and repoName)
    // ensure that the URL matches the current provider
    // TODO check this is not totally broken
    switch (this.providerType) {
      case 'github':
        return `https://raw.githubusercontent.com/${repo}`;
      case 'gitlab':
        return `https://${this.provider}/gitlab/${repo}`;
      case 'bitbucket':
        return `https://${this.provider}/bitbucket/${repo}`;
      case 'codeberg':
        return `https://${this.provider}/codeberg/${repo}`;
      default:
        throw new Error('Unknown provider');
    }
  }

  async createPR(target) {
    // create a pull request of the current gm branch to the target branch
    // use appropriate API endpoint based on the provider
    // use title and body text as provided below:
    let title = 'mei-friend PR for branch ' + this.gm.branch;
    let body = 'This PR was automatically created using mei-friend';
    switch (this.providerType) {
      case 'github':
        return fetch(`https://api.github.com/repos/${this.gm.repo}/pulls`, {
          method: 'POST',
          headers: this.apiHeaders,
          body: JSON.stringify({
            title: title,
            body: body,
            head: this.gm.branch,
            base: target,
          }),
        }).then((res) => res.json());
      case 'gitlab':
        return fetch(`https://gitlab.com/api/v4/projects/${this.gm.repo}/merge_requests`, {
          method: 'POST',
          headers: this.apiHeaders,
          body: JSON.stringify({
            title: title,
            description: body,
            source_branch: this.gm.branch,
            target_branch: target,
          }),
        }).then((res) => res.json());
      case 'bitbucket':
        return fetch(`https://api.bitbucket.org/2.0/repositories/${this.gm.repo}/pullrequests`, {
          method: 'POST',
          headers: this.apiHeaders,
          body: JSON.stringify({
            title: title,
            description: body,
            source: {
              branch: {
                name: this.gm.branch,
              },
            },
            destination: {
              branch: {
                name: target,
              },
            },
          }),
        }).then((res) => res.json());
      case 'codeberg':
        return fetch(`https://codeberg.org/api/v1/repos/${this.gm.repo}/pulls`, {
          method: 'POST',
          headers: this.apiHeaders,
          body: JSON.stringify({
            title: title,
            body: body,
            head: this.gm.branch,
            base: target,
          }),
        }).then((res) => res.json());
      default:
        throw new Error('Unknown provider');
    }
  }

  async fetchFileContents(rawUri) {
    // TODO make this work for other git providers
    const components = rawUri.match(/https:\/\/raw.githubusercontent.com\/([^/]+)\/([^/]+)\/([^/]+)(.*)$/);
    let headers = { ...this.apiHeaders };
    headers.Accept = 'application/vnd.github.raw'; // add raw accept header
    try {
      const fileContentsUrl = `https://api.github.com/repos/${components[1]}/${components[2]}/contents${components[4]}`;
      console.log('fetchFileContents: attempting to use fileContentsUrl ', fileContentsUrl);
      console.log('Using headers ', headers);
      return await fetch(fileContentsUrl, {
        method: 'GET',
        headers: headers,
      });
    } catch (e) {
      console.warn('Failed to fetch file contents', e);
    }
  }

  async replaceContentType(fileContentsUrl, result) {
    // TODO make this work for other git providers
    return result.replace('application/vnd.github.raw', uriSuffixToMimetype(fileContentsUrl));
  }

  async fork(callback, forkTo = this.userLogin) {
    let forksUrl;
    switch (this.providerType) {
      case 'github':
        forksUrl = `https://api.github.com/repos/${this.gm.repo}/forks`;
        break;
      case 'gitlab':
        forksUrl = `https://gitlab.com/api/v4/projects/${encodeURIComponent(this.gm.repo)}/fork`;
        break;
      case 'bitbucket':
        forksUrl = `https://api.bitbucket.org/2.0/repositories/${this.gm.repo}/forks`;
        break;
      case 'codeberg':
        forksUrl = `https://codeberg.org/api/v1/repos/${this.gm.repo}/forks`;
        break;
      default:
        throw new Error('Unknown provider');
    }
    await fetch(forksUrl, {
      method: 'GET',
      headers: this.apiHeaders,
    })
      .then((res) => {
        if (res.status <= 400) return res.json();
        else throw res;
      })
      .then(async (data) => {
        const userFork = data.filter((f) => f.owner.login === forkTo)[0];
        // If we don't yet have a user fork, create one
        if (!userFork) {
          // create new fork for user
          let fetchRequestObject = {
            method: 'POST',
            headers: this.apiHeaders,
          };
          let author = await this.getAuthor();
          if (forkTo !== author.username) {
            // if we are forking to an organization rather than
            // the user's personal repositories, we have to add
            // a note to say so to the request body
            fetchRequestObject.body = JSON.stringify({
              organization: forkTo,
            });
          }
          await fetch(forksUrl, fetchRequestObject).then((res) => {
            if (res.status <= 400) {
              res.json().then((userFork) => {
                // switch to newly created fork
                this.gm.repo = userFork.full_name;
                // initialise page with user's fork
                callback();
              });
            } else throw res;
          });
        } else {
          this.gm.repo = userFork.full_name;
          // initialise page with user's fork
          callback();
        }
      })
      .catch((err) => {
        console.warn("Couldn't retrieve forks from ", forksUrl, ': ', err);
        return Promise.reject(err);
      });
  }

  // TODO refactor so that this information is stored on getActionWorkflowsList
  // to avoid extra fetch with getWorkflowInputs when workflow is clicked
  async getWorkflow(wfPath) {
    // rewrite to raw github URL
    const rawUrl = 'https://raw.githubusercontent.com/' + this.repo + '/' + this.branch + '/' + wfPath;
    return this.gm
      .directlyReadFileContents(rawUrl, {
        method: 'GET',
        headers: this.apiHeaders,
      })
      .then((yaml) => {
        const asJson = jsyaml.load(yaml);
        asJson.path = wfPath;
        if (env === environments.develop) {
          console.debug('Obtained workflow description: ', asJson, wfPath);
        }
        return asJson;
      });
  } // getWorkflow()

  // obtain inputs for a specified workflow (if any)
  async getWorkflowInputs(wfPath) {
    // rewrite to raw github URL
    const rawUrl = 'https://raw.githubusercontent.com/' + this.repo + '/' + this.branch + '/' + wfPath;
    return this.gm
      .directlyReadFileContents(rawUrl, {
        method: 'GET',
        headers: this.apiHeaders,
      })
      .then((yaml) => {
        const asJson = jsyaml.load(yaml);
        if (env === environments.develop) {
          console.debug('Obtained workflow description: ', asJson, wfPath);
        }
        // repetition below to ensure that the value of e.g. asJson.on.workflow_dispatch is not null
        if (
          asJson &&
          'on' in asJson &&
          'workflow_dispatch' in asJson.on &&
          asJson.on.workflow_dispatch &&
          'inputs' in asJson.on.workflow_dispatch &&
          asJson.on.workflow_dispatch.inputs
        ) {
          return asJson.on.workflow_dispatch.inputs;
        } else return null;
      });
  }

  // obtain details for a specified workflow run
  async getWorkflowRun(runUrl) {
    return fetch(runUrl, {
      method: 'GET',
      headers: this.actionsHeaders,
    }).then((res) => res.json());
  } // getWorkflowRun()

  async getActionWorkflowsList(per_page = 30, page = 1) {
    // TODO make this work for other git providers
    if (!this.providerType === 'github') {
      console.warn('getActionWorkflowsList() only works for GitHub');
      return;
    }
    const actionsUrl = `https://api.github.com/repos/${this.gm.repo}/actions/workflows?per_page=${per_page}&page=${page}`;
    return fetch(actionsUrl, {
      method: 'GET',
      headers: this.actionsHeaders,
    })
      .then((res) => res.json())
      .then(async (data) => {
        let list = null;
        // (longwinded) way to only show dispatch workflows
        if ('workflows' in data) {
          let promises = data.workflows.map((w) => this.getWorkflow(w.path));
          let fulfilled = await Promise.all(promises);
          let filtered = fulfilled.filter((w) => 'on' in w && 'workflow_dispatch' in w.on);
          let pathsToKeep = filtered.map((f) => f.path);
          list = data.workflows.filter((d) => pathsToKeep.includes(d.path));
        }
        return list;
      })
      .catch((e) => {
        console.error('Error fetching action workflows list: ', e);
        return [];
      });
  }

  async requestActionWorkflowRun(workflowId, inputs = {}) {
    const dispatchUrl = `https://api.github.com/repos/${this.gm.repo}/actions/workflows/${workflowId}/dispatches`;
    return fetch(dispatchUrl, {
      method: 'POST',
      headers: this.actionsHeaders,
      body: JSON.stringify({
        ref: this.gm.branch,
        inputs: inputs,
      }),
    }).then((res) => {
      // return body as JSON object, but retain response status (for error detection)
      console.log('::::::', res);
      if (res.status === 204) {
        // no body on github 204 responses
        return res;
      } else {
        res.json().then((data) => {
          return { status: res.status, body: data };
        });
      }
    });
  }

  async awaitActionWorkflowCompletion(workflowId, runStartAt = null) {
    // TODO make this work for other git providers
    if (!this.providerType === 'github') {
      console.warn('awaitActionWorkflowCompletion() only works for GitHub');
      return;
    }
    // Wait until the created workflow has completed or failed
    // n.b.: unfortunately, because workflow dispatch is implemented as a Web Hook on the GitHub side,
    // the job's run instance ID is not known at creation time. See https://github.com/orgs/community/discussions/9752
    // As a work-around, we grab the latest run instance requested by the current user, of the requested workflow,
    // ... with the current head hash, immediately after dispatch
    // ... then grab its start_at time, and use that to poll recursively
    const runsUrl = `https://api.github.com/repos/${this.gm.repo}/actions/workflows/${workflowId}/runs`;
    const author = await this.getAuthor();
    const head_sha = await this.gm.getCurrentHeadSha();
    console.log('head_sha: ', head_sha);
    return fetch(
      runsUrl +
        '?' +
        new URLSearchParams({
          actor: author.username,
          branch: this.gm.branch,
          head_sha,
        }),
      {
        method: 'GET',
        headers: this.actionsHeaders,
        cache: 'no-store', // do not cache response to prevent delays to polling update
      }
    )
      .then((res) => res.json())
      .then((resJson) => {
        let run;
        if ('workflow_runs' in resJson) {
          if (runStartAt) {
            // start time specified -- use it to find our run of interest
            let runsAt = resJson.workflow_runs.filter((w) => w.run_started_at === runStartAt);
            if (runsAt.length) {
              run = runsAt[0];
              console.log('Got run with starttime specified, first entry of: ', runsAt);
            }
          } else {
            // no start time specified -- pick the most recent one
            let runsSorted = resJson.workflow_runs.sort((a, b) => b.run_number - a.run_number);
            console.log('Got run WITHOUT starttime specified, first entry of: ', runsSorted);
            if (runsSorted.length) {
              run = runsSorted[0];
            }
          }
          if (run && 'status' in run && run.status === 'completed') {
            return run; // done
          } else if (run && 'status' in run) {
            // recur
            return this.awaitActionWorkflowCompletion(workflowId, run.run_started_at);
          } else {
            console.error('Received unexpected response to workflow runs request, retrying:', resJson);
            return this.awaitActionWorkflowCompletion(workflowId);
          }
        } else {
          console.error('Received unexpected response to workflow runs request:', resJson);
          return { status: 406 };
        }
      });
  } // awaitActionWorkflowCompletion()
}

function uriSuffixToMimetype(uri) {
  const types = {
    mei: 'application/xml',
    xml: 'application/xml',
    mxl: 'application/vnd.recordare.musicxml',
    abc: 'text/plain',
    krn: 'text/plain',
    pae: 'text/plain',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    tif: 'image/tiff',
    tiff: 'image/tiff',
    svg: 'image/svg+xml',
    webp: 'image/webp',
  };
  const tkeys = Object.keys(types);
  const suffix = uri.substring(uri.lastIndexOf('.') + 1);
  const matches = tkeys.filter((k) => suffix.localeCompare(k, undefined, { sensitivity: 'base' }) == 0);
  if (matches.length) {
    return types[matches[0]];
  }
  return 'application/octet-stream'; //default type
} // uriSuffixToMimetype()
