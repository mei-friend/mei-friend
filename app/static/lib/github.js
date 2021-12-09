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
    // TODO don't hardcode 'main' as branch
    this.headHash = await this.repo.readRef("refs/heads/main");
    this.commit = await this.repo.loadAs("commit", this.headHash);
    const tree = await this.repo.loadAs("tree", this.commit.tree);
    this.entry = tree["README.md"];
    this.content = await this.repo.loadAs("text", this.entry.hash);
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
    // TODO don't hardcode 'main' as branch
    const updates = [{
      path: this.filepath,
      mode: this.entry.mode, // preserve mode of existing file (e.g. executable)
      content: content
    }];
    const treeHash = await this.repo.createTree(updates);
    updates.base = this.commit.tree;
    const commitHash = await this.repo.saveAs("commit", { 
      tree: treeHash,
      author: this.author,
      parent: this.headHash,
      message: message
    });
    await this.repo.updateRef("refs/heads/main", commitHash);
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
    // TODO don't hardcode 'main' as branch; allow user to specify body
    const pullsUrl = `https://api.github.com/repos/${this.upstreamRepoOwner}/${this.upstreamRepoName}/pulls`
    if(this.isFork) { 
      await fetch(pullsUrl, { 
        method: 'POST',
        headers: this.apiHeaders,
        body: JSON.stringify({
          head: this.githubRepoOwner+":"+'main',
          base: 'main',
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
}

/*

function formatCommitLog(github) { 
  let logTableContent = `
    <tr>
      <th>Time</th>
      <th>User</th>
      <th>Message</th>
      <th>SHA</th>
    <tr>`;
  github.commitLog.forEach((c) => { 
    logTableContent += `
    <tr>
      <td>${c.commit.author.date}</td>
      <td><a href="${c.author.html_url}">${c.commit.author.name}</a></td>
      <td>${c.commit.message}</td>
      <td><a href="${c.commit.url}">${c.sha.slice(0,8)}...</a></td>
    </tr>`;
  });
  console.log("commits log: ", logTableContent);
  return logTableContent;
}

async function handlePullRequest(github, resp) { 
  console.log("This is where I would handle the pull request response: ", resp);
}

async function initPageWithRepo(github) {
  console.log("INIT PAGE: ", github);
  const submitButton = document.querySelector("#submit");
  const prButton = document.querySelector("#pullRequest");
  const textBox = document.querySelector("#textBox");
  const commitMessageBox = document.querySelector("#commitMessageBox")
  const textBoxLabel = document.querySelector("#textBoxLabel");
  const logTable = document.querySelector("#commitLog");

  textBoxLabel.innerHTML = github.githubRepo + ": " + github.filepath;

  await github.readGithubRepo().then(() => {
    textBox.value = github.content;
    textBox.disabled = false;
    prButton.disabled = false;
    console.log("formating commits:", github);
    logTable.innerHTML = formatCommitLog(github);
  })

  textBox.addEventListener("input", () => {
    submitButton.disabled = textBox.value === github.content ? true : false;
    commitMessageBox.disabled = submitButton.disabled;
  });

  commitMessageBox.addEventListener("input", () => {
    commitMessageBox.style.border="";
  });

  submitButton.addEventListener("click", () => {
    if(commitMessageBox.value) { 
      // Fork the repository first if necessary 
      const toWrite = textBox.value;
      textBoxLabel.innerHTML = "<strong>Writing to GitHub repository...</strong>";
      textBox.disabled = true;
      commitMessageBox.disabled = true;
      submitButton.disabled = true;
      prButton.disabled = true;
      logTable.innerHTML = "";
      github.writeGithubRepo(toWrite, commitMessageBox.value)
        .then(() => github.readGithubRepo())
        .then(() => {
          textBox.value = github.content;
          commitMessageBox.value = "";
          textBoxLabel.innerHTML = github.githubRepo + ": " + github.filepath;
          textBox.disabled = false;
          prButton.disabled = false;
          console.log("formating commits:", github);
          logTable.innerHTML = formatCommitLog(github);
          });
    } else {
      commitMessageBox.style.border="2px solid red";
    }
  });

  prButton.addEventListener("click", () => { 
    github.pullRequest(handlePullRequest)
      .then(() => commitMessageBox.style.border="2px solid green");
  });
}

async function init(githubRepo, githubToken, filepath, userLogin, userName, userEmail) {
  const github = new Github(
    githubRepo, 
    githubToken,
    filepath,
    userLogin,
    userName,
    userEmail
  );

  if(github.githubRepoOwner !== userLogin) { 
    // switch to user's fork (or create a new one)
    console.log("Switching to user fork (creating it first if necessary)...")
    github.fork(initPageWithRepo);
  } else {
    initPageWithRepo(github);
  }
}

window.onload = async () => {
  const filepath = "README.md";
  await init(githubRepo, githubToken, filepath, userLogin, userName, userEmail);
}*/
