export default class GitCloudClient {
  constructor(conf) {
    console.log('GitCloudClient constructor', conf);
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
    return fetch(this.orgsUrl, {
      method: 'GET',
      headers: this.apiHeaders,
    }).then((res) => res.json());
    // fetch all organizations the user belongs to from the cloud provider
    console.log('getOrganizations');
  }

  async getRepos(per_page = 30, page = 1) {
    const reposUrl = `https://api.github.com/user/repos?per_page=${per_page}&page=${page}`;
    return fetch(reposUrl, {
      method: 'GET',
      headers: this.apiHeaders,
    }).then((res) => res.json());
  }

  async getBranches(per_page = 30, page = 1) {
    // fetch all branches of the current repository from the cloud provider
    const branchesUrl = `https://api.github.com/repos/${this.repo}/branches?per_page=${per_page}&page=${page}`;
    return fetch(branchesUrl, {
      method: 'GET',
      headers: this.apiHeaders,
    }).then((res) => res.json());
  }

  async getCommits(repo, branch) {
    // fetch all commits of the current repository and branch from the cloud provider
    console.log('getCommits');
  }

  async getFiles(repo, branch, path) {
    // fetch all files of the current repository and branch from the cloud provider
    // use appropriate API endpoint based on the provider
    switch (this.providerType) {
      case 'github':
        return fetch(`https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`, {
          method: 'GET',
          headers: this.apiHeaders,
        }).then((res) => res.json());
      case 'gitlab':
        return fetch(`https://gitlab.com/api/v4/projects/${repo}/repository/tree?ref=${branch}&path=${path}`, {
          method: 'GET',
          headers: this.apiHeaders,
        }).then((res) => res.json());
      case 'bitbucket':
        return fetch(`https://api.bitbucket.org/2.0/repositories/${repo}/src/${branch}/${path}`, {
          method: 'GET',
          headers: this.apiHeaders,
        }).then((res) => res.json());
      case 'codeberg':
        return fetch(`https://codeberg.org/api/v1/repos/${repo}/contents/${path}?ref=${branch}`, {
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
    console.log('setAuthor: ', user);
    let author = {};
    // set the author object to the provided object
    author.name = user.name || user.login;
    author.username = user.login;
    author.email = user.email || '';
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
}
