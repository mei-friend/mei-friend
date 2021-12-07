//importScripts("https://www.verovio.org/javascript/latest/verovio-toolkit-hum.js");
importScripts('../verovio/verovio-toolkit-hum.js');

// see also:
// https://github.com/DDMAL/Neon/pull/426/commits/f52981ad0927644927e5249f9fbe4ab6e9413f86
// https: //github.com/DDMAL/Neon/blob/master/src/workers/VerovioWorker.js

var tk;
var tkOptions;

loadVerovio = function() {
  /* create the worker toolkit instance */
  console.log('Loading toolkit...');
  tk = new verovio.toolkit();
  let message = {
    'cmd': 'vrvLoaded',
    'msg': tk.getVersion(),
    'availableOptions': tk.getAvailableOptions()
  };
  console.log('...done.')
  postMessage(message);
  return;
}
loadVerovio.bind(this);

onmessage = function(e) {
  let result = e.data;
  if (!tk && e.data.cmd !== 'loadVerovio') return result;
  console.info("Worker received: " + result.cmd + ', ', result); // + ', tk:', tk);
  switch (result.cmd) {
    case 'loadVerovio':
      Module.onRuntimeInitialized = loadVerovio();
      return;
    case 'updateAll':
      try {
        var tkOptions = result.options;
        tk.setOptions(tkOptions);
        tk.loadData(result.mei);
        result.mei = '';
        if (result.xmlId)
          result.pageNo = parseInt(tk.getPageWithElement(result.xmlId));
        result.svg = tk.renderToSVG(result.pageNo);
        result.pageCount = tk.getPageCount();
        result.cmd = 'updated';
      } catch (e) {
        log(e);
      };
      break;
    case 'updateData':
      try {
        tk.loadData(result.mei);
        result.mei = '';
        if (result.xmlId)
          result.pageNo = parseInt(tk.getPageWithElement(result.xmlId));
        result.svg = tk.renderToSVG(result.pageNo);
        result.pageCount = tk.getPageCount();
        result.cmd = 'updated';
      } catch (e) {
        log(e);
      };
      break;
    case 'updatePage':
      try {
        if (result.xmlId)
          result.pageNo = parseInt(tk.getPageWithElement(result.xmlId));
        result.svg = tk.renderToSVG(result.pageNo);
        result.cmd = 'updated';
      } catch (e) {
        log(e);
      };
      break;
    case 'updateLayout':
      try {
        var tkOptions = result.options;
        tk.setOptions(tkOptions);
        tk.redoLayout();
        if (result.xmlId)
          result.pageNo = parseInt(tk.getPageWithElement(result.xmlId));
        result.svg = tk.renderToSVG(result.pageNo);
        result.pageCount = tk.getPageCount();
        result.cmd = 'updated';
      } catch (e) {
        log(e);
      };
      break;
    case 'updateOption': // just update option without redoing layout
      try {
        var tkOptions = result.options;
        tk.setOptions(tkOptions);
        if (result.xmlId)
          result.pageNo = parseInt(tk.getPageWithElement(result.xmlId));
        result.svg = tk.renderToSVG(result.pageNo);
        result.pageCount = tk.getPageCount();
        result.cmd = 'updated';
      } catch (e) {
        log(e);
      };
      break;
    case 'importData': // all non-MEI formats
      try {
        tk.setOptions({
          inputFrom: result.format
        })
        tk.loadData(result.msg);
        result = {
          'cmd': 'mei',
          'msg': tk.getMEI(),
          'pageCount': tk.getPageCount()
        };
        if (tkOptions) tk.setOptions(tkOptions);
      } catch (e) {
        log(e);
      }
      break;
    case 'importBinaryData': // compressed XML format
      console.log('importBinaryData ' +
        result.msg.byteLength + ' / ', result.msg);
      try {
        tk.setOptions({
          inputFrom: result.format
        })
        // tk.loadZipDataBase64(result.msg);
        tk.loadZipDataBuffer(result.msg, result.msg.byteLength)
        result = {
          'cmd': 'mei',
          'msg': tk.getMEI(),
          'pageCount': tk.getPageCount()
        };
        if (tkOptions) tk.setOptions(tkOptions);
      } catch (e) {
        log(e);
      }
      break;
    case 'redoLayout':
      try {
        tk.redoLayout();
        console.log('redoLayout tkOptions: ', tk.getOptions());
        result = {
          'cmd': 'pageCount',
          'msg': tk.getPageCount()
        };
      } catch (e) {
        log(e);
      }
      break;
    case 'getPage':
      try {
        result = {
          'cmd': 'svg',
          'msg': tk.renderToSVG(result.msg)
        };
      } catch (e) {
        log(e);
      }
      break;
    case 'getMEI':
      try {
        result = {
          'cmd': 'mei',
          'msg': tk.getMEI(result.msg),
          'pageCount': tk.getPageCount()
        };
      } catch (e) {
        log(e);
      }
      break;
    case 'navigatePage': // for a page turn during navigation
      try { // returns original message plus svg
        result.svg = tk.renderToSVG(result.msg);
      } catch (e) {
        log(e);
      }
      break;
    case 'getTimeForElement':
      try {
        result = {
          'cmd': 'timeForElement',
          'msg': tk.getTimeForElement(result.msg)
        };
      } catch (e) {
        log(e);
      }
      break;
    case 'getElementAttr':
      try {
        result = {
          'cmd': 'elementAttr',
          'msg': tk.getElementAttr(result.msg)
        };
      } catch (e) {
        log(e);
      }
      break;
    case 'stop':
      result = {
        'cmd': 'stopped',
        'msg': 'Worker stopped: ' + result.msg + '.'
      };
      close(); // Terminates the worker.
      break;
    default:
      result = {
        'cmd': result.cmd,
        'msg': 'Unknown command: ' + result.msg
      };
  };
  if (result) postMessage(result);
}

function log(e) {
  console.log('Worker error: ', e);
  return;
}
