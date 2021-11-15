// var Verovio = require('verovio');
importScripts('../verovio/verovio-toolkit.js');
// speed worker

// see also:
// https://github.com/DDMAL/Neon/pull/426/commits/f52981ad0927644927e5249f9fbe4ab6e9413f86
// https: //github.com/DDMAL/Neon/blob/master/src/workers/VerovioWorker.js

var tk;
loadVerovio = function() {
  /* create the worker toolkit instance */
  console.log('Loading toolkit...');
  tk = new verovio.toolkit();
  result = {
    'cmd': 'vrvLoaded',
    'msg': tk.getVersion()
  };
  console.log('...done.')
  postMessage(result);
}
loadVerovio.bind(this);

onmessage = function(e) {
  var data = e.data;
  console.info("Worker received: ", data.cmd);
  let result = '';
  switch (data.cmd) {
    case 'loadVerovio':
      Module.onRuntimeInitialized = loadVerovio();
      break;
    case 'getAvailableOptions':
      result = {
        'cmd': 'availableOptions',
        'msg': tk.getAvailableOptions()
      };
      break;
    case 'getVersion':
      result = {
        'cmd': 'version',
        'msg': tk.getVersion()
      };
      break;
    case 'setOptions':
      tk.setOptions(data.msg);
      result = {
        'cmd': 'optionsSet',
        'msg': true
      };
      break;
    case 'loadData':
      try {
        tk.loadData(data.msg);
        result = {
          'cmd': 'pageCount',
          'msg': tk.getPageCount()
        };
      } catch (e) {
        console.log(e);
        return;
      }
      break;
    case 'redoLayout':
      try {
        tk.redoLayout();
        result = {
          'cmd': 'pageCount',
          'msg': tk.getPageCount()
        };
      } catch (e) {
        console.log(e);
        return;
      }
      break;
    case 'getPage':
      try {
        result = {
          'cmd': 'svg',
          'msg': tk.renderToSVG(data.msg)
        };
      } catch (e) {
        console.log(e);
        return;
      }
      break;
    case 'getMEI':
      try {
        result = {
          'cmd': 'mei',
          'msg': tk.getMEI(data.msg)
        };
      } catch (e) {
        console.log(e);
        return;
      }
      break;
    case 'getTimeForElement':
      try {
        result = {
          'cmd': 'timeForElement',
          'msg': tk.getTimeForElement(data.msg)
        };
      } catch (e) {
        console.log(e);
        return;
      }
      break;
    case 'getElementAttr':
      try {
        result = {
          'cmd': 'elementAttr',
          'msg': tk.getElementAttr(data.msg)
        };
      } catch (e) {
        console.log(e);
        return;
      }
      break;
    case 'stop':
      result = {
        'cmd': 'stopped',
        'msg': 'Worker stopped: ' + data.msg + '.'
      };
      close(); // Terminates the worker.
      break;
    default:
      result = {
        'cmd': data.msg,
        'msg': 'Unknown command: ' + data.msg
      };
  };
  if (result) postMessage(result);
}

// self.addEventListener('message', function(e) {
//   self.postMessage(e.data);
// }, false);
