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

  async #prepareClone(url, branch) {
    // check if directory exists, if so check if changes have been made, etc.
    // if directory exists, delete it (ideally after giving user option to commit changes)
    // then clone
    await pfs
      .stat(this.directory)
      .then((stats) => {
        // directory exists
        // TODO safety dance: check if changes have been made, give user option to commit, etc.
        console.log('directory exists', stats);
        // delete the directory
        removeRecursively(this.directory).catch((err) => {
          console.log('rmdir error', err);
        });
      })
      .catch((err) => {
        if (err.code === 'ENOENT') {
          return false; // directory does not exist, all is well
        } else {
          // another error occurred...
          console.log('stat error', err);
          throw err;
        }
      })
      .finally(() => {
        this.#doClone(url, branch);
      });
  }

  async #doClone(url, branch) {
    // update branch
    this.branch = branch;
    console.log('cloning into', this.directory, this.token);
    await pfs.mkdir(this.directory);
    let cloneobj = {
      fs,
      http,
      url,
      dir: this.directory,
      ref: branch,
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
  }

  async clone(url = this.cloud.getCloneURL(), branch = this.branch) {
    // external function to clone a repository
    this.#prepareClone(url, branch);
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
    });
  }

  async add(path = this.filepath) {
    await git.add({
      fs,
      dir: this.directory,
      filepath: path,
    });
  }

  async commit(message) {
    await git.commit({
      fs,
      dir: this.directory,
      message: message,
    });
  }

  async status() {
    return await git.status({
      fs,
      dir: this.directory,
      filepath: 'README.md',
    });
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

  async fileModified(path = this.filepath) {
    // check if a file in the repo has been modified
    // only necessary if information not available from cloud provider

    // strip leading slash to make git.status happy
    if (path.startsWith('/')) {
      path = path.substring(1);
    }
    try {
      let status = await git.status({
        fs,
        dir: this.directory,
        filepath: path,
      });
      console.log('status', status);
      return status !== 'unmodified' && status !== 'ignored' && status !== 'absent';
    } catch (err) {
      console.error('fileModified error', err);
      throw err;
    }
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

  async writeToLocalGit(path, content) {
    // ensure that we have cloned the repo
    if (!(await this.pfsDirExists())) {
      await this.clone().then(async () => {
        console.log('attempting to write to', this.directory + path);
        await pfs.writeFile(this.directory + path, content, 'utf8');
      });
    } else {
      await pfs.writeFile(this.directory + '/' + path, content, 'utf8');
    }
  }
}

async function removeRecursively(path) {
  console.log('removing recursively: ', path);
  try {
    // Read the contents of the directory
    let files = await pfs.readdir(path);

    // Loop over each file or subdirectory
    for (let file of files) {
      let fullPath = `${path}/${file}`;
      let stats = await pfs.stat(fullPath);

      if (stats.type === 'dir') {
        // If it's a directory, call the function recursively
        await removeRecursively(fullPath);
      } else {
        // If it's a file, delete it
        await pfs.unlink(fullPath);
      }
    }

    // After all files/subdirectories are removed, remove the directory itself
    await pfs.rmdir(path);
    console.log(`Directory '${path}' removed successfully`);
  } catch (err) {
    console.error(`Failed to remove directory '${path}':`, err);
  }
}

/*console.log('git.js loaded');

let gm = new GitManager('github', 'github', githubToken);
console.log('gm created');
//console.log('readdir', await pfs.readdir(git.dir));
let test = 'github';
if (test === 'github') {
  console.log('github');
  await gm.clone('https://github.com/isogit-test/private');
} else if (test === 'gitlab') {
  console.log('gitlab');
  await gm.clone('https://gitlab.com/musicog/test-public.git');
}
console.log('cloned');
console.log('reading', gm.directory);
let out = await pfs.readdir(gm.directory);
console.log('read', out);
let contents = await gm.readFile('./README.md');
console.log('contents', contents);
//console.log('readdir', await pfs.readdir(git.dir));
//await gm.clone('https://github.com/isogit-test/private');
await gm.status();
console.log('git.js executed');
*/
