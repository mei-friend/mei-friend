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
    switch (this.providerType) {
      case 'github':
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
    console.log('setAuthor: ', user);
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
