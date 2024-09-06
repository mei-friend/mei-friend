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
    this.filepath = opts.filepath || '/' ;
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
    this.cloud = new GitCloudClient({ token, provider, providerType });
  }

  async clone(url) {
    // TODO safety dance: check if directory exists, if so check if changes have been made, etc.
    // wipe the pfs directory
    await pfs.rmdir(this.directory, { recursive: true });
    console.log('cloning into', this.directory, this.token);
    await pfs.mkdir(this.directory);
    let cloneobj = {
      fs,
      http,
      url,
      dir: this.directory,
      ref: 'main',
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

  async push() {
    await git.push({
      fs,
      http,
      dir: this.directory,
    });
  }

  async add(path) {
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
    return await pfs.readFile(this.directory + '/' + path, 'utf8');
  }

  async readDir(path = gm.filepath.substring(0, github.filepath.lastIndexOf('/'))){
    // defaults to reading containing dir of current filepath if no path is provided
    return await pfs.readdir(this.directory + '/' + path);
  }

  async readLog() {
    return await git.log({
      fs,
      dir: this.directory,
      depth: 10,
      ref: this.branch,
    });
  }
  async listBranches() {
    return await git.listBranches({
      fs,
      dir: this.directory,
    });
  }
}

console.log('git.js loaded');

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
