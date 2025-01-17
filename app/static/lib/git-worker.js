// Description: Web Worker for working with Git.
importScripts(
  'https://unpkg.com/@isomorphic-git/lightning-fs',
  'https://unpkg.com/isomorphic-git@beta',
  'https://unpkg.com/isomorphic-git@beta/http/web/index.umd.js',
  'git-manager.js'
);

let gm = null;

let methods = {
  registerGitManager: (provider, providerType, token, opts) => {
    gm[provider] = new GitManager(provider, providerType, token);
    return 'Success!';
  },
  cloneRepository: (provider, url, branch) => {
    gm[provider].clone(url, branch);
    return true;
  },
};

// Listen to messages send to this worker
addEventListener(
  'message',
  function (event) {
    // Destruct properties passed to this message event
    const { taskId, method, args } = event.data;

    // Check if verovio toolkit has passed method
    const fn = methods[method || null];
    let result;
    if (fn) {
      //console.debug( "Calling", method );
      result = fn.apply(null, args || []);
    } else {
      console.warn('Unknown', method);
    }

    // Always respond to worker calls with postMessage
    postMessage(
      {
        taskId,
        method,
        args,
        result,
      },
      event
    );
  },
  false
);
