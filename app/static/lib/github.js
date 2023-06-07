export default class Github {
  constructor(githubRepo, githubToken, branch, commit, filepath, userLogin, authorName, authorEmail) {
    this.githubToken = githubToken;
    this.githubRepo = githubRepo;
    this.branch = branch;
    this.commit = commit;
    this.filepath = filepath;
    this.userLogin = userLogin;
    this.author = {
      name: authorName,
      email: authorEmail,
    };
    this.apiHeaders = new Headers({
      Authorization: 'Basic ' + btoa(userLogin + ':' + githubToken),
      Accept: 'application/vnd.github.v3+json',
    });
    this.directReadHeaders = new Headers({
      Authorization: 'Basic ' + btoa(userLogin + ':' + githubToken),
      Accept: 'application/vnd.github.raw',
    });
    this.actionsHeaders = new Headers({
      Authorization: 'Basic ' + btoa(userLogin + ':' + githubToken),
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    })
    // remember this as our 'upstream' repo in case we need to fork
    this.upstreamRepoName = this.githubRepoName;
    this.upstreamRepoOwner = this.githubRepoOwner;
  }

  set content(content) {
    this._content = content;
  }

  get content() {
    return this._content;
  }

  set updatesBase(updatesBase) {
    this._updatesBase = updatesBase;
  }

  get updatesBase() {
    return this._updatesBase;
  }

  set commit(commit) {
    this._commit = commit;
  }

  get commit() {
    return this._commit;
  }

  set tree(tree) {
    this._tree = tree;
  }

  get tree() {
    return this._tree;
  }

  set commitLog(commitLog) {
    this._commitLog = commitLog;
  }

  get commitLog() {
    return this._commitLog;
  }

  set repo(repo) {
    this._repo = repo;
  }

  get repo() {
    // no setter...
    return this._repo;
  }

  set userLogin(userLogin) {
    this._userLogin = userLogin;
  }

  get userLogin() {
    return this._userLogin;
  }

  set githubRepo(githubRepo) {
    this._githubRepo = githubRepo;
    // also set repo owner and repo name
    [this._githubRepoOwner, this._githubRepoName] = githubRepo.split('/');
    // initialise jsgit repo object
    const repo = {};
    jsgit.mixins.github(repo, this.githubRepo, this.githubToken);
    jsgit.mixins.createTree(repo);
    jsgit.mixins.packOps(repo);
    jsgit.mixins.walkers(repo);
    jsgit.mixins.readCombiner(repo);
    jsgit.mixins.formats(repo);
    jsgit.promisify(repo);
    this.repo = repo;
  }

  get githubRepo() {
    return this._githubRepo;
  }

  set githubRepoName(githubRepoName) {
    // not allowed: needs to be set via githubRepo
    console.warn('githubRepoName cannot be set directly - please set githubRepo');
  }

  get githubRepoName() {
    return this._githubRepoName;
  }

  set githubRepoOwner(githubRepoOwner) {
    // not allowed: needs to be set via githubRepo
    console.warn('githubRepoOwner cannot be set directly - please set githubRepo');
  }

  get githubRepoOwner() {
    return this._githubRepoOwner;
  }

  set githubToken(githubToken) {
    this._githubToken = githubToken;
  }

  get githubToken() {
    return this._githubToken;
  }

  set upstreamRepoName(upstreamRepoName) {
    this._upstreamRepoName = upstreamRepoName;
  }

  get upstreamRepoName() {
    return this._upstreamRepoName;
  }

  set upstreamRepoOwner(upstreamRepoOwner) {
    this._upstreamRepoOwner = upstreamRepoOwner;
  }

  get upstreamRepoOwner() {
    return this._upstreamRepoOwner;
  }

  set filepath(filepath) {
    this._filepath = filepath;
  }

  get filepath() {
    return this._filepath;
  }

  set branch(branch) {
    this._branch = branch;
  }

  get branch() {
    return this._branch;
  }

  set author(author) {
    this._author = author;
  }

  get author() {
    return this._author;
  }

  set entry(entry) {
    this._entry = entry;
  }

  get entry() {
    return this._entry;
  }

  set commitLog(commitLog) {
    this._commitLog = commitLog;
  }

  get commitLog() {
    return this._commitLog;
  }

  set isFork(isFork) {
    console.warn('The isFork flag is set automatically; please do not attempt to set it manually');
  }

  get isFork() {
    return this.githubRepoOwner !== this.upstreamRepoOwner;
  }

  // Recursively dive into tree until we find the file we're updating.
  // Update the file, then construct hashes all the way back up
  async generateModifiedTreeHash(tree, filepath, content, newfile) {
    // split into path components and discard leading empty string using filter
    // (in case filepath starts with slash)
    let pathComponents = filepath.split('/').filter((p) => p);
    if (pathComponents.length === 1) {
      // Basecase: we've arrived at the subdir containing our file...
      let entry = tree[pathComponents[0]];
      // replace with new content and get new hash
      let entryHash = await this.repo.saveAs('text', content);
      if (newfile) {
        // user has requested creation of a new file based off current entry
        // so clone it with the new name
        tree[newfile] = {
          mode: entry.mode,
          hash: entryHash,
        };
      } else {
        // modify tree with updated entry
        tree[pathComponents[0]] = {
          mode: entry.mode,
          hash: entryHash,
        };
      }
      // calculate and return treeHash for the modified tree:
      return await this.repo.saveAs('tree', tree);
    } else if (pathComponents.length > 1) {
      // we still have some traversing to do
      // load the next subtree along our filepath:
      let subtree = await this.repo.loadAs('tree', tree[pathComponents[0]].hash);
      // and recurse on it to get a modified (sub)treeHash
      let subtreeHash = await this.generateModifiedTreeHash(
        subtree,
        pathComponents.splice(1, pathComponents.length).join('/'),
        content,
        newfile
      );
      // modify this tree with new subtreeHash
      tree[pathComponents[0]] = {
        mode: tree[pathComponents[0]].mode, // retain old entry's permissions
        hash: subtreeHash,
      };
      // and return modified tree's treeHash
      return await this.repo.saveAs('tree', tree);
    } else {
      console.error('Problem figuring out pathComponents for:', filepath);
    }
  }

  async writeGithubRepo(content, message, newfile = null) {
    this.headHash = await this.repo.readRef(`refs/heads/${this.branch}`);
    this.commit = await this.repo.loadAs('commit', this.headHash);
    let tree = await this.repo.loadAs('tree', this.commit.tree);
    let treeHash = await this.generateModifiedTreeHash(tree, this.filepath, content, newfile);
    let commitHash = await this.repo.saveAs('commit', {
      tree: treeHash,
      author: this.author,
      parent: this.headHash,
      message: message,
    });
    await this.repo.updateRef(`refs/heads/${this.branch}`, commitHash);
    console.debug('Commit complete: ', commitHash);
    // update headHash to new commit's
    this.headHash = await this.repo.readRef(`refs/heads/${this.branch}`);
  }

  async loadGitFileContent(hash) {
    if (this.filepath.endsWith('.mxl')) {
      // file suffix suggests compressed musicxml => binary blob
      let blob = await this.repo.loadAs('blob', hash);
      this.content = blob.buffer; // convert from Uint8array to arraybuffer
    } else {
      this.content = await this.repo.loadAs('text', hash);
    }
  }

  async directlyReadFileContents(rawGithubUri) {
    const components = rawGithubUri.match(/https:\/\/raw.githubusercontent.com\/([^/]+)\/([^/]+)\/([^/]+)(.*)$/);
    if (components) {
      try {
        const fileContentsUrl = `https://api.github.com/repos/${components[1]}/${components[2]}/contents${components[4]}`;
        return await fetch(fileContentsUrl, {
          method: 'GET',
          headers: this.directReadHeaders,
        })
          .then((res) => {
            // if image or blob, read base64 encoding
            // otherwise read text
            if (isImageUri(rawGithubUri) || isBlobUri(rawGithubUri)) {
              return res.blob();
            } else {
              return res.text();
            }
          })
          .then((data) => {
            if (typeof data === 'string') {
              return new Promise((resolve) => resolve(data));
            } else {
              return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  const result = reader.result;
                  if (typeof result == 'string') {
                    // result is a dataUrl; replace default raw github content-type with correct one for resource
                    result.replace('application/vnd.github.raw', uriSuffixToMimetype(rawGithubUri));
                  }
                  resolve(result);
                };
                if (isBlobUri(rawGithubUri)) {
                  reader.readAsArrayBuffer(data);
                } else {
                  // image - read as data URL to allow inline embedding
                  reader.readAsDataURL(data);
                }
              });
            }
          });
      } catch (e) {
        console.error("Couldn't directly read file contents: ", e);
      }
    } else {
      console.warn('Called github.directlyReadFileContents with invalid rawGithubUri: ', rawGithubUri);
    }
  }

  async readGithubRepo() {
    try {
      // Retrieve content of file
      this.headHash = await this.repo.readRef(`refs/heads/${this.branch}`);
      this.commit = await this.repo.loadAs('commit', this.headHash);
      let tree = await this.repo.loadAs('tree', this.commit.tree);
      this.entry = tree[this.filepath.startsWith('/') ? this.filepath.substring(1) : this.filepath];
      let treeStream = await this.repo.treeWalk(this.commit.tree);
      let obj;
      let trees = [];
      while (((obj = await treeStream.read()), obj !== undefined)) {
        trees.push(obj);
      }
      const treesFiltered = trees.filter((o) => o.path === this.filepath);
      if (treesFiltered.length === 1) {
        await this.loadGitFileContent(treesFiltered[0].hash);
      } else {
        if (this.filepath && this.filepath !== '/') {
          // remove leading slash
          await this.loadGitFileContent(this.entry.hash);
          this.tree = tree;
        }
      }
      // Retrieve git commit log
      const commitsUrl = `https://api.github.com/repos/${this.githubRepo}/commits`;
      await fetch(commitsUrl, {
        method: 'GET',
        headers: this.apiHeaders,
      })
        .then((res) => res.json())
        .then(async (commits) => {
          this.commitLog = commits;
        });
    } catch (e) {
      console.error('Error while reading Github repo: ', e, this);
      throw e;
    }
  }

  async getOrganizations() {
    // return JSON object describing user's memberships in
    // organizations we have access to
    const orgsUrl = `https://api.github.com/user/memberships/orgs`;
    return fetch(orgsUrl, {
      method: 'GET',
      headers: this.apiHeaders,
    }).then((res) => res.json());
    // TODO inspect the organizations list and return those
    // that give the user writing permission
    /*
      .then((orgs) => orgs.map((o) => {
          console.log("fethcing: ", o.url)
          return fetch(o.url,
           {
              method: 'GET',
              headers: this.apiHeaders
           }
          ).then(o => o.json())
          .then((data) => console.log("Got DATA: ", data, "for ", o.url))
        })
      )
    */
  }

  async fork(callback, forkTo = this.userLogin) {
    // switch to a user's fork, creating it first if necessary
    const forksUrl = `https://api.github.com/repos/${this.githubRepo}/forks`;
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
          if (forkTo !== this.userLogin) {
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
                this.githubRepo = userFork.full_name;
              });
            } else throw res;
          });
        } else {
          this.githubRepo = userFork.full_name;
        }
        // initialise page with user's fork
        callback(this);
      })
      .catch((err) => {
        console.warn("Couldn't retrieve forks from ", forksUrl, ': ', err);
        return Promise.reject(err);
      });
  }

  async pullRequest(callback) {
    // TODO allow PR to be done against a different branch in upstream repo
    const pullsUrl = `https://api.github.com/repos/${this.upstreamRepoOwner}/${this.upstreamRepoName}/pulls`;
    if (this.isFork) {
      await fetch(pullsUrl, {
        method: 'POST',
        headers: this.apiHeaders,
        body: JSON.stringify({
          head: this.githubRepoOwner + ':' + this.branch,
          base: this.branch,
          body: 'Programmatic Pull-Request created using prositCommit',
          title: 'Programmatic Pull-Request created using prositCommit',
        }),
      })
        .then((res) => res.json())
        .then(async (data) => callback(this, data));
    } else {
      console.warn('Attempted to create pull-request but repo is not a fork');
    }
  }

  async getSpecifiedUserOrgRepos(userOrg, per_page = 30, page = 1) {
    const reposUrl = `https://api.github.com/users/${userOrg}/repos?per_page=${per_page}&page=${page}`;
    return fetch(reposUrl, {
      method: 'GET',
      headers: this.apiHeaders,
    }).then((res) => res.json());
  }

  async getUserRepos(per_page = 30, page = 1) {
    const reposUrl = `https://api.github.com/user/repos?per_page=${per_page}&page=${page}`;
    return fetch(reposUrl, {
      method: 'GET',
      headers: this.apiHeaders,
    }).then((res) => res.json());
  }

  async getRepoBranches(per_page = 30, page = 1) {
    const branchesUrl = `https://api.github.com/repos/${this.githubRepo}/branches?per_page=${per_page}&page=${page}`;
    return fetch(branchesUrl, {
      method: 'GET',
      headers: this.apiHeaders,
    }).then((res) => res.json());
  }

  async getBranchContents(path = '/') {
    const contentsUrl = `https://api.github.com/repos/${this.githubRepo}/contents${path}`;
    return fetch(contentsUrl, {
      method: 'GET',
      headers: this.apiHeaders,
    }).then((res) => res.json());
  }

  async getActionWorkflowsList(per_page = 30, page = 1) { 
    const actionsUrl = `https://api.github.com/repos/${this.githubRepo}/actions/workflows?per_page=${per_page}&page=${page}`;
    return fetch(actionsUrl, { 
      method: 'GET', 
      headers: this.actionsHeaders,
    }).then((res => res.json()))
  }

  async requestActionWorkflowRun(workflowId, inputs = {}) { 
    const dispatchUrl = `https://api.github.com/repos/${this.githubRepo}/actions/workflows/${workflowId}/dispatches`;
    return fetch(dispatchUrl, {
      method: 'POST',
      headers: this.actionsHeaders,
      body: JSON.stringify({ 
        ref: this.branch,
        inputs: inputs
      })
    }).then((res) =>  {
      // return body as JSON object, but retain response status (for error detection)
      console.log("::::::", res);
      if(res.status === 204) {
        // no body on github 204 responses
        return res;
      } else { 
        res.json().then((data) => {
          return {status: res.status, body: data}
        });
      }
    })
  }

  async awaitActionWorkflowCompletion(workflowId, runStartAt = null) { 
    // Wait until the created workflow has completed or failed
    // n.b.: unfortunately, because workflow dispatch is implemented as a Web Hook on the GitHub side,
    // the job's run instance ID is not known at creation time. See https://github.com/orgs/community/discussions/9752
    // As a work-around, we grab the latest run instance requested by the current user, of the requested workflow, 
    // ... with the current head hash, immediately after dispatch
    // ... then grab its start_at time, and use that to poll recursively
    const runsUrl = `https://api.github.com/repos/${this.githubRepo}/actions/workflows/${workflowId}/runs`;
    return fetch(runsUrl + "?" + new URLSearchParams({
        actor: this.userLogin,
        branch: this.branch,
        head_sha: this.headHash
      }), {
        method: 'GET',
        headers: this.actionsHeaders,
      }).then((res) => res.json())
      .then((resJson) => { 
        let run;
        if("workflow_runs" in resJson) { 
          if(runStartAt) { 
            // start time specified -- use it to find our run of interest
            let runsAt = resJson.workflow_runs.filter(w => w.run_started_at === runStartAt);
            if(runsAt.length) { 
              run = runsAt[0];
              console.log("Got run with starttime specified, first entry of: ", runsAt)
            }
          } else { 
            // no start time specified -- pick the most recent one
            let runsSorted = resJson.workflow_runs.sort((a, b) => b.run_number - a.run_number)
            console.log("Got run WITHOUT starttime specified, first entry of: ", runsSorted)
            if(runsSorted.length) {
              run = runsSorted[0];
            }
          }
          if(run && "status" in run && run.status === "completed") { 
            return run; // done
          }
          else if(run && "status" in run){ 
            // recur
            return this.awaitActionWorkflowCompletion(workflowId, run.run_started_at);
          } else { 
            console.error("Received unexpected response to workflow runs request, retrying:", resJson);
            return this.awaitActionWorkflowCompletion(workflowId);
          }
        } else { 
          console.error("Received unexpected response to workflow runs request:", resJson);
          return { status: 406 }
        }
      })
    } // awaitActionWorkflowCompletion()

    // obtain details for a specified workflow run
    async getWorkflowRun(runUrl) { 
      return fetch(runUrl, { 
        method: 'GET',
        headers: this.actionsHeaders
      }).then((res) => res.json());
    }

    // obtain inputs for a specified workflow (if any)
    async getWorkflowInputs(wfPath) { 
      // rewrite to raw github URL
      const rawUrl = "https://raw.githubusercontent.com/" + this.githubRepo + "/" + this.branch + "/" + wfPath;
      return this.directlyReadFileContents(rawUrl, { 
        method: 'GET',
        headers: this.apiHeaders
      }).then((yaml) => {
          const asJson = jsyaml.load(yaml);
          if(env === environments.develop) {
            console.debug("Obtained workflow description: ", asJson, wfPath);
          }
          // repetition below to ensure that the value of e.g. asJson.on.workflow_dispatch is not null
          if(asJson && "on" in asJson 
            && "workflow_dispatch" in asJson.on && asJson.on.workflow_dispatch
            && "inputs" in asJson.on.workflow_dispatch && asJson.on.workflow_dispatch.inputs) { 
            return asJson.on.workflow_dispatch.inputs;
          } else return null;
        });
    }
}

function isImageUri(uri) {
  // images
  const imgSuffices = ['gif', 'jpg', 'jpeg', 'png', 'tif', 'tif', 'webp'];
  return isUriWithSuffix(uri, imgSuffices);
}

function isBlobUri(uri) {
  // binary objects (currently: compressed musicxml files)
  const blobSuffices = ['mxl', 'zip'];
  return isUriWithSuffix(uri, blobSuffices);
}

function isUriWithSuffix(uri, suffices) {
  // return true if uri has a suffix and it matches one of the provided ones (case-insensitively)
  const suffix = uri.substring(uri.lastIndexOf('.') + 1);
  return suffices.filter((s) => suffix.localeCompare(s, undefined, { sensitivity: 'base' }) == 0).length;
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
}
