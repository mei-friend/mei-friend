import http from 'https://unpkg.com/isomorphic-git@beta/http/web/index.js';

window.fs = new LightningFS('fs', { wipe: true });
window.pfs = window.fs.promises; // promisified version of fs, for your convenience

export default class GitManager {
  constructor() {
    console.log('GitManager constructor');
    this.gitdir = '/gitdir';
    this.providerSpecific_onAuth = {
      //see https://isomorphic-git.org/docs/en/onAuth#docsNav
      //n.b. currently only tested with github
      //we need a mechanism to support multiple different instances of decentralized git providers
      github: () => ({ username: githubToken, password: 'x-oauth-basic' }),
      gitlab: () => ({ username: 'oauth2', password: gitlabToken }),
      bitbucket: () => ({ username: 'x-token-auth', password: bitbucketToken }),
    };
    this.cloud;
  }

  async clone(url) {
    console.log('cloning into', this.gitdir, githubToken);
    await pfs.mkdir(this.gitdir);
    let cloneobj = {
      fs,
      http,
      url,
      dir: this.gitdir,
      ref: 'main',
      corsProxy: '/proxy',
      singleBranch: true,
      // need a mechanism to decide which provider to use
      onAuth: this.providerSpecific_onAuth['github'],
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
      dir: this.gitdir,
    });
  }

  async add(path) {
    await git.add({
      fs,
      dir: this.gitdir,
      filepath: path,
    });
  }

  async commit(message) {
    await git.commit({
      fs,
      dir: this.gitdir,
      message: message,
    });
  }

  async status() {
    return await git.status({
      fs,
      dir: this.gitdir,
      filepath: 'README.md',
    });
  }

  async readFile(path) {
    return await pfs.readFile(this.gitdir + '/' + path, 'utf8');
  }
}

console.log('git.js loaded');

let gm = new GitManager();
console.log('gm created');
//console.log('readdir', await pfs.readdir(git.dir));
await gm.clone('https://github.com/isogit-test/private');
//await gm.clone('https://github.com/musicog/test-encodings');
console.log('cloned');
console.log('reading', gm.gitdir);
let out = await pfs.readdir(gm.gitdir);
console.log('read', out);
let contents = await gm.readFile('./README.md');
console.log('contents', contents);
//console.log('readdir', await pfs.readdir(git.dir));
//await gm.clone('https://github.com/isogit-test/private');
await gm.status();
console.log('git.js executed');
