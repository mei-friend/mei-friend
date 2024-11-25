import http from '../deps/isomorphic-git.http.js';
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

  async createBranch(commitMsg) {
    // create a new branch, commiting and pushing changes to it:
    // first, generate a new branch name like this.username + number
    // where number is the next unused number for this.username
    let branches = await this.listBranches();
    let author = await this.cloud.getAuthor();
    let username = author.username;
    console.log('creating branch for user', username);
    // search for branches that start with username
    let userBranches = branches.filter((branch) => branch.startsWith(username + '-'));
    console.log('userBranches', userBranches);
    // find the highest number
    let highest = 0;
    userBranches.forEach((branch) => {
      console.log('considering', branch);
      let num = parseInt(branch.substring(username.length + 1));
      if (num && num > highest) {
        highest = num;
      }
    });
    let branch = username + '-' + (highest + 1);
    // then create the branch locally
    await git.branch({ fs, dir: this.directory, ref: branch });
    // update the branch in the gm object
    this.branch = branch;
    // commit to the new branch
    await this.commit(commitMsg);
    // check out the branch
    await this.checkout();
    // then push the branch to the remote
    await this.push();

    return branch;
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
      ref: this.branch,
      remoteRef: 'refs/heads/' + this.branch,
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
    await this.add(this.filepath);
    await git.commit({
      fs,
      dir: this.directory,
      author: await this.cloud.getAuthor(),
      ref: this.branch,
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
      let content;
      // remove leading slash if present
      if (path.startsWith('/')) {
        path = path.substring(1);
      }
      if (isBlobUri(path)) {
        //  content = await pfs.readFile(this.directory + '/' + path, { encoding: null });
        // determine current commit oid
        console.log('reading blob file', this.directory + '/' + path);
        let oid = await git.resolveRef({
          fs,
          dir: this.directory,
          ref: this.branch,
        });
        // read the file at the current commit
        content = await git.readBlob({
          fs,
          dir: this.directory,
          oid: oid,
          filepath: path,
        });
        content = content.blob.buffer;
        return content;
      } else {
        console.log('reading file', this.directory + '/' + path);
        content = await pfs.readFile(this.directory + '/' + path, 'utf8');
        return content;
      }
    } catch (err) {
      console.error('readFile error', err);
      // TODO let the user know that the file does not exist
      throw err;
    }
  }

  async readDir(path = this.filepath.substring(0, this.filepath.lastIndexOf('/'))) {
    // defaults to reading containing dir of current filepath if no path is provided
    // ensure path has a leading slash
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    return await pfs.readdir(this.directory + path);
  }

  async readLog() {
    return this.cloud.getCommits(this.repo, this.branch);
  }

  async directlyReadFileContents(rawUri) {
    return this.cloud
      .fetchFileContents(rawUri)
      .then((res) => {
        // if image or blob, read base64 encoding
        // otherwise read text
        if (isImageUri(rawUri) || isBlobUri(rawUri)) {
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
              let result = reader.result;
              if (typeof result == 'string') {
                // result is a dataUrl; replace default raw github content-type with correct one for resource
                result = this.cloud.replaceContentType(rawUri, result);
              }
              resolve(result);
            };
            if (isBlobUri(rawUri)) {
              reader.readAsArrayBuffer(data);
            } else {
              // image - read as data URL to allow inline embedding
              reader.readAsDataURL(data);
            }
          });
        }
      });
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
    // only necessary if information not available from cloud provider
    return (await pfs.stat(this.directory + '/' + path)).type === 'dir';
  }

  async writeAndReturnStatus(content, path = this.filepath) {
    // ensure that path has a leading slash
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    // ensure that we have cloned the repo
    if (!(await this.pfsDirExists())) {
      console.log('repo not cloned, cloning');
      return await this.clone().then(async () => {
        console.log('attempting to write to', this.directory + path);
        await pfs.writeFile(this.directory + path, content, 'utf8');
        return await this.status(path);
      });
    } else {
      console.log('attempting to write directly to', this.directory + path);
      await pfs.writeFile(this.directory + path, content, 'utf8');
      return await this.status();
    }
  }

  async fork(callback, forkTo) {
    return await this.cloud.fork(callback, forkTo);
  }

  async getAuthor() {
    return await this.cloud.getAuthor();
  }

  async getBranches(per_page, page, repo) {
    return await this.cloud.getBranches(per_page, page, repo);
  }

  async getRepos(per_page, page) {
    return await this.cloud.getRepos(per_page, page);
  }

  async getOrgs() {
    return await this.cloud.getOrgs();
  }

  async getSpecifiedUserOrgRepos(userOrg, per_page, page) {
    return await this.cloud.getSpecifiedUserOrgRepos(userOrg, per_page, page);
  }

  async createPR(branch) {
    return await this.cloud.createPR(branch);
  }

  async getWorkflowInputs(path) {
    return await this.cloud.getWorkflowInputs(path);
  }

  async awaitActionWorkflowCompletion(workflowId) {
    return await this.cloud.awaitActionWorkflowCompletion(workflowId);
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
} // removeRecursively()

// helper functions to determine the type of a URI

function isImageUri(uri) {
  // images
  const imgSuffices = ['gif', 'jpg', 'jpeg', 'png', 'tif', 'tif', 'webp'];
  return isUriWithSuffix(uri, imgSuffices);
} // isImageUri()

function isBlobUri(uri) {
  // binary objects (currently: compressed musicxml files)
  const blobSuffices = ['mxl', 'zip'];
  return isUriWithSuffix(uri, blobSuffices);
} // isBlobUri()

function isUriWithSuffix(uri, suffices) {
  // return true if uri has a suffix and it matches one of the provided ones (case-insensitively)
  const suffix = uri.substring(uri.lastIndexOf('.') + 1);
  return suffices.filter((s) => suffix.localeCompare(s, undefined, { sensitivity: 'base' }) == 0).length;
} // isUriWithSuffix()
