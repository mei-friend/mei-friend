export default class Github { 
  constructor(githubRepo, githubToken, filepath, userLogin, authorName, authorEmail) {
    this.githubRepo = githubRepo;
    this.githubToken = githubToken;
    this.filepath = filepath;
    this.author = { 
      name: authorName,
      email: authorEmail
    };
    this.apiHeaders = new Headers({
      'Authorization': 'Basic ' + btoa(userLogin + ":" + githubToken), 
      'Accept': 'application/vnd.github.v3+json'
    });
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
    console.error("githubRepoName cannot be set directly - please set githubRepo");
  }

  get githubRepoName() {
    return this._githubRepoName;
  }

  set githubRepoOwner(githubRepoOwner) { 
    // not allowed: needs to be set via githubRepo
    console.error("githubRepoOwner cannot be set directly - please set githubRepo");
  }

  get githubRepoOwner() { 
    return this._githubRepoOwner;
  }

  set githubToken(githubToken) { 
    this._githubToken = githubToken;
  }

  get githubToken(){
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
    console.error("The isFork flag is set automatically; please do not attempt to set it manually")
  }

  get isFork() { 
    return this.githubRepoOwner !== this.upstreamRepoOwner;
  }

  async readGithubRepo() { 
    // Retrieve content of file
    this.headHash = await this.repo.readRef(`refs/heads/${this.branch}`);
    this.commit = await this.repo.loadAs("commit", this.headHash);  
    const tree = await this.repo.loadAs("tree", this.commit.tree);
    if(this.filepath && this.filepath !== "/") {
      // remove leading slash
      this.entry = tree[this.filepath.startsWith("/") ? this.filepath.substr(1) : this.filepath];
      this.content = await this.repo.loadAs("text", this.entry.hash);
    }
    // Retrieve git commit log
    const commitsUrl = `https://api.github.com/repos/${this.githubRepo}/commits`;
    await fetch(commitsUrl, {
      method: 'GET',
      headers: this.apiHeaders
    }).then(res => res.json())
      .then(async(commits) => { 
        this.commitLog = commits;
      });

  }

  async writeGithubRepo(content, message) { 
    const updates = [{
      path: this.filepath,
      mode: this.entry.mode, // preserve mode of existing file (e.g. executable)
      content: content
    }];
    updates.base = this.commit.tree;
    const treeHash = await this.repo.createTree(updates);
    const commitHash = await this.repo.saveAs("commit", { 
      tree: treeHash,
      author: this.author,
      parent: this.headHash,
      message: message
    });
    await this.repo.updateRef(`refs/heads/${this.branch}`, commitHash);
  }

  async fork(callback) {
    // switch to a user's fork, creating it first if necessary
    const forksUrl = `https://api.github.com/repos/${this.githubRepo}/forks`;
    await fetch(forksUrl, {
      method: 'GET',
      headers: this.apiHeaders
    })
      .then(res => res.json())
      .then(async(data) => {
        const userFork = data.filter(f => f.owner.login === this.userLogin)[0];
        // If we don't yet have a user fork, create one
        if(!userFork) {
          // create new fork for user
          await fetch(forksUrl, {
            method:'POST',
            headers: this.apiHeaders
          }).then(res => res.json())
            .then(async(userFork) => { 
                // now switch to it
                this.githubRepo = userFork.full_name;
            });
        } else { 
          this.githubRepo = userFork.full_name;
        }
        // initialise page with user's fork
        callback(this);
      }).catch(err => {
        console.error("Couldn't retrieve forks from ", forksUrl, ": ", err);
      });
  }

  async pullRequest(callback) { 
    // TODO allow PR to be done against a different branch in upstream repo
    const pullsUrl = `https://api.github.com/repos/${this.upstreamRepoOwner}/${this.upstreamRepoName}/pulls`
    if(this.isFork) { 
      await fetch(pullsUrl, { 
        method: 'POST',
        headers: this.apiHeaders,
        body: JSON.stringify({
          head: this.githubRepoOwner + ":" + this.branch,
          base: this.branch,
          body: 'Programmatic Pull-Request created using prositCommit',
          title: 'Programmatic Pull-Request created using prositCommit'
        })
      }).then(res => res.json())
        .then(async(data) => callback(this, data));
    } else { 
      console.error("Attempted to create pull-request but repo is not a fork");
    }
  }

  async getUserRepos(per_page=30, page=1) { 
    const reposUrl = `https://api.github.com/user/repos?per_page=${per_page}&page=${page}`;
    return fetch(reposUrl, {
      method: 'GET',
      headers: this.apiHeaders
    }).then(res => res.json())
  }

  async getRepoBranches(per_page=30, page=1) {
    const branchesUrl = `https://api.github.com/repos/${this.githubRepo}/branches?per_page=${per_page}&page=${page}`;
    return fetch(branchesUrl, {
      method: 'GET',
      headers: this.apiHeaders
    }).then(res => res.json())
  }
  
  async getBranchContents(path="/") {
    const contentsUrl = `https://api.github.com/repos/${this.githubRepo}/contents${path}`;
    this.filepath = path;
    return fetch(contentsUrl, {
      method: 'GET',
      headers: this.apiHeaders
    }).then(res => res.json())
  }
}

