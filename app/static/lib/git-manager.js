import http from 'https://unpkg.com/isomorphic-git@beta/http/web/index.js';
import GitCloudClient from './git-cloud-client.js';

window.fs = new LightningFS('fs', { wipe: true });
window.pfs = window.fs.promises; // promisified version of fs, for your convenience

export default class GitManager {
  constructor(provider, providerType, token) {
    console.log('GitManager constructor', provider, providerType, token);
    this.token = token;
    this.directory = '/' + provider; // e.g. '/github'
    this.provider = provider;
    this.providerType = providerType;
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
    console.log('cloning into', this.directory, this.token);
    await pfs.mkdir(this.directory);
    let cloneobj = {
      fs,
      http,
      url,
      dir: this.directory,
      ref: 'main',
      corsProxy: '/proxy',
      singleBranch: true,
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

  async readFile(path) {
    return await pfs.readFile(this.directory + '/' + path, 'utf8');
  }
}

console.log('git.js loaded');

let gm = new GitManager('github', 'github', githubToken);
console.log('gm created');
//console.log('readdir', await pfs.readdir(git.dir));
await gm.clone('https://github.com/isogit-test/private');
//await gm.clone('https://github.com/musicog/test-encodings');
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
