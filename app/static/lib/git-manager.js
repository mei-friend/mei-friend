import http from 'https://unpkg.com/isomorphic-git@beta/http/web/index.js';
import GitCloudClient from './git-cloud-client.js';

window.fs = new LightningFS('fs', { wipe: true });
window.pfs = window.fs.promises; // promisified version of fs, for your convenience

export default class GitManager {
  constructor(provider, providerType, token, opts = {}) {
    console.log('GitManager constructor', provider, providerType, token);
    this.token = token;
    this.directory = '/' + provider; // e.g. '/github'
    this.provider = provider;
    this.providerType = providerType;
    this.cloud = new GitCloudClient({ gm: this, token, provider, providerType });

    this.filepath = opts.filepath || '';
    this.repo = opts.repo || null;
    this.branch = opts.branch || null;
    //set up type-specific onAuth, see https://isomorphic-git.org/docs/en/onAuth#docsNav
    switch (providerType) {
      case 'github':
        this.onAuth = () => ({ username: this.token, password: 'x-oauth-basic' });
        break;
      case 'gitlab':
        this.onAuth = () => ({ username: 'oauth2', password: this.token });
        break;
      case 'bitbucket':
        this.onAuth = () => ({ username: 'x-token-auth', password: this.token });
        break;
      case 'codeberg':
        this.onAuth = () => ({ username: 'oauth2', password: this.token });
        break;
      default:
        throw new Error('Unknown provider');
    }
  }

  set repo(repo) {
    this.cloud.repo = repo;
  }

  get repo() {
    return this.cloud.repo;
  }

  async checkout() {
    // first perform a fetch to ensure we have all branches
    await this.fetch();
    // now checkout the branch
    return await git.checkout({
      fs,
      dir: this.directory,
      ref: this.branch,
    });
  }

  async fetch() {
    return await git.fetch({
      fs,
      http,
      onAuth: this.onAuth,
      onAuthFailure: () => {
        console.log('auth failure');
        return { cancel: true };
      },
      onAuthSuccess: () => {
        console.log('auth success');
      },
      dir: this.directory,
    });
  }

  async #prepareClone(url, branch) {
    // check if directory exists, if so check if changes have been made, etc.
    // if directory exists, delete it (ideally after giving user option to commit changes)
    // then clone
    try {
      let stats = await pfs.stat(this.directory);
      // directory exists
      // TODO safety dance: check if changes have been made, give user option to commit, etc.
      console.log('directory exists', this.directory, stats);
      // delete the directory
      return removeRecursively(this.directory);
    } catch (err) {
      if (err.code === 'ENOENT') {
        // directory does not exist, all is well
        console.log('directory does not exist, all is well');
      } else {
        // another error occurred...
        console.log('stat error', err);
        throw err;
      }
    }
  }

  async #doClone(url, branch) {
    // update branch
    this.branch = branch;
    // create directory
    console.log('creating directory', this.directory);
    return await pfs.mkdir(this.directory).then(async () => {
      await pfs.stat(this.directory).then(async (stat) => {
        console.log('directory created:', stat);
        console.log('cloning into', this.directory, this.token);
        console.log('with branch ', this.branch);
        let cloneobj = {
          fs,
          http,
          url,
          dir: this.directory,
          ref: this.branch,
          corsProxy: '/proxy',
          singleBranch: false,
          onAuth: this.onAuth,
          onAuthFailure: () => {
            console.log('auth failure');
            return { cancel: true };
          },
          onAuthSuccess: () => {
            console.log('auth success');
          },
        };
        console.log('cloneobj', cloneobj);
        await git.clone(cloneobj);
        console.log('cloned into ', this.directory);
        console.log('current branch says: ', await this.getBranch());
        console.log('readdir', await pfs.readdir(this.directory));
      });
    });
  }

  async clone(url = this.cloud.getCloneURL(), branch = this.branch) {
    // run the clone process:
    // first run #prepareClone to check if the directory exists and delete it if it does
    // then run #doClone to actually clone the repo
    // note: ensure both functions are run before returning
    await this.#prepareClone(url, branch).then(async () => {
      await this.#doClone(url, branch);
    });
  }

  async getBranch() {
    return await git.currentBranch({
      fs,
      dir: this.directory,
    });
  }

  async getRemote() {
    console.log('getRemote(), git: ', git, 'dir: ', this.directory, 'fs: ', fs);
    return git
      .listRemotes({
        fs,
        dir: this.directory,
      })
      .then((remote) => {
        const remoteUrl = remote[0].url;
        console.log('getRemote(), remoteUrl: ', remoteUrl);
        if (remoteUrl) {
          switch (this.providerType) {
            // TODO check these, they are imagined by copilot
            // particularly, they should use the provider in the URI
            case 'github':
              return remoteUrl.match(/github.com\/([^/]+\/.+)/)[1];
            case 'gitlab':
              return remoteUrl.match(/gitlab.com\/([^/]+\/.+)/)[1];
            case 'bitbucket':
              return remoteUrl.match(/bitbucket.org\/([^/]+\/.+)/)[1];
            case 'codeberg':
              return remoteUrl.match(/codeberg.org\/([^/]+\/.+)/)[1];
            default:
              throw new Error('Unknown provider');
          }
        }
      });
  }

  async push() {
    await git.push({
      fs,
      http,
      dir: this.directory,
      onAuth: this.onAuth,
      onAuthFailure: () => {
        console.log('auth failure');
        return { cancel: true };
      },
      onAuthSuccess: () => {
        console.log('auth success');
      },
    });
  }

  async add(path = this.filepath) {
    if (path.startsWith('/')) {
      path = path.substring(1);
    }
    console.log('add', this.filepath, path, this.directory);
    if (path) {
      await git.add({
        fs,
        dir: this.directory,
        filepath: path,
      });
    } else {
      console.log('git-manager: add() called with no path');
    }
  }

  async commit(message) {
    await git.commit({
      fs,
      dir: this.directory,
      author: await this.cloud.getAuthor(),
      message: message,
    });
  }

  async status(path = this.filepath) {
    if (path.startsWith('/')) {
      path = path.substring(1);
    }
    return await git.status({
      fs,
      dir: this.directory,
      filepath: path,
    });
  }

  async fileChanged(path = this.filepath) {
    let status = await this.status(path);
    console.log('git-manager fileChanged status:', status);
    return status !== 'unmodified' && status !== 'absent';
  }

  async readFile(path = this.filepath) {
    try {
      return await pfs.readFile(this.directory + '/' + path, 'utf8');
    } catch (err) {
      console.error('readFile error', err);
      // TODO let the user know that the file does not exist
      throw err;
    }
  }

  async readDir(path = this.filepath.substring(0, this.filepath.lastIndexOf('/'))) {
    // defaults to reading containing dir of current filepath if no path is provided
    return await pfs.readdir(this.directory + '/' + path);
  }

  async readLog() {
    return this.cloud.getCommits(this.repo, this.branch);
  }

  async listBranches() {
    return await git.listBranches({
      fs,
      dir: this.directory,
    });
  }

  async listContents(path = this.filepath) {
    // use the cloud client to fetch the contents of the current repository and branch
    return await this.cloud.getFiles(this.repo, this.branch, path);
  }

  async pfsDirExists() {
    // check whether there is a directory in the pfs at this.directory
    try {
      let stat = await pfs.stat(this.directory);
      console.log('pfsDirExists() directory, stat:', this.directory, stat);
      return stat.isDirectory();
    } catch (err) {
      if (err.code === 'ENOENT') {
        return false;
      } else {
        throw err;
      }
    }
  }

  async isDir(path = this.filepath) {
    // check if a path in the repo is a directory
    // on;y necessary if information not available from cloud provider
    return (await pfs.stat(this.directory + '/' + path)).type === 'dir';
  }

  async writeAndReturnStatus(content, path = this.filepath) {
    // ensure that we have cloned the repo
    console.log('called writeToLocalGit with path', path);
    if (!(await this.pfsDirExists())) {
      console.log('repo not cloned, cloning');
      return await this.clone().then(async () => {
        console.log('attempting to write to', this.directory + path);
        await pfs.writeFile(this.directory + path, content, 'utf8');
        await this.add();
        return await this.status();
      });
    } else {
      console.log('attempting to write directly to', this.directory + path);
      await pfs.writeFile(this.directory + '/' + path, content, 'utf8');
      await this.add();
      return await this.status();
    }
  }
}

// function removeRecursively:
// recursively remove a directory and its contents

async function removeRecursively(path) {
  console.log('removing recursively: ', path);
  // Check if the path exists and is a directory
  let stat = await pfs.stat(path);
  if (stat.isDirectory()) {
    let files = await pfs.readdir(path);
    // Loop over each file or subdirectory
    let promises = [];
    for (let file of files) {
      let fullPath = `${path}/${file}`;
      promises.push(removeRecursively(fullPath));
    }
    // After all files/subdirectories are removed, remove the directory itself
    console.log('Promises: ', promises);
    await Promise.all(promises);
    console.log(`Removing Directory '${path}'`);
    return pfs.rmdir(path);
  } else {
    // If it's a file, delete it
    console.log(`Deleting file '${path}'`);
    return pfs.unlink(path);
  }
}
