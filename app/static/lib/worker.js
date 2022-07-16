// importScripts("https://www.verovio.org/javascript/develop/verovio-toolkit-hum.js");
importScripts("https://www.verovio.org/javascript/3.10.0/verovio-toolkit-hum.js");
//importScripts("https://www.verovio.org/javascript/latest/verovio-toolkit-wasm.js");
// importScripts(`../verovio-toolkit-hum.js`);

var tk;
var tkOptions;

loadVerovio = function () {
  /* create the worker toolkit instance */
  console.log('Verovio Worker: Loading toolkit...');
  try {
    tk = new verovio.toolkit();
    let message = {
      'cmd': 'vrvLoaded',
      'version': tk.getVersion(),
      'availableOptions': tk.getAvailableOptions()
    };
    console.log('...done.');
    return message;
  } catch (err) {
    log(err);
  };
}
loadVerovio.bind(this);

onmessage = function (e) {
  let result = e.data;
  result.forceUpdate = false;
  if (!tk && e.data.cmd !== 'loadVerovio') return result;
  console.info("Worker received: " + result.cmd + ', ', result); // + ', tk:', tk);
  switch (result.cmd) {
    case 'loadVerovio':
      let mes = Module.onRuntimeInitialized = loadVerovio();
      postMessage(mes);
      return;
    case 'updateAll':
      try {
        tkOptions = result.options;
        if (result.speedMode &&
          !result.computePageBreaks && tkOptions.breaks != 'none')
          tkOptions.breaks = 'encoded';
        tk.setOptions(tkOptions);
        let r = tk.loadData(result.mei);
        if (!r) {
          result.cmd = 'error';
          result.msg = 'Cannot load MEI data.';
          break;
        }
        result.mei = '';
        if (result.xmlId && !result.speedMode) {
          result.pageNo = parseInt(tk.getPageWithElement(result.xmlId));
          result.forceUpdate = true;
        }
        if (!result.speedMode) {
          result.pageCount = tk.getPageCount();
          if (result.pageNo > result.pageCount) result.pageNo = result.pageCount;
        }
        result.pageNo = Math.max(1, result.pageNo);
        let pg = (result.speedMode && result.pageNo > 1) ? 2 : result.pageNo;
        result.svg = tk.renderToSVG(pg);
        result.cmd = 'updated';
      } catch (err) {
        log(err);
      };
      break;
    case 'updateData':
      try {
        if (result.speedMode && result.breaks != 'none')
          result.breaks = 'encoded';
        tk.setOptions({
          breaks: result.breaks
        });
        let r = tk.loadData(result.mei);
        if (!r) {
          result.cmd = 'error';
          result.msg = 'Cannot load MEI data.';
          break;
        }
        result.mei = '';
        if (result.xmlId && !result.speedMode) {
          result.pageNo = parseInt(tk.getPageWithElement(result.xmlId));
          result.forceUpdate = true;
        }
        let pg = (result.speedMode && result.pageNo > 1) ? 2 : result.pageNo;
        result.svg = tk.renderToSVG(pg);
        result.pageCount = tk.getPageCount();
        result.cmd = 'updated';
      } catch (err) {
        log(err);
      };
      break;
    case 'updatePage':
      try {
        result.setCursorToPageBeginning = true;
        if (result.xmlId && !result.speedMode) {
          result.pageNo = parseInt(tk.getPageWithElement(result.xmlId));
          result.setCursorToPageBeginning = false;
          result.forceUpdate = true;
        }
        result.svg = tk.renderToSVG(result.pageNo);
        result.cmd = 'updated';
      } catch (err) {
        log(err);
      };
      break;
    case 'updateLayout':
      try {
        tkOptions = result.options;
        if (result.speedMode && result.breaks != 'none')
          tkOptions.breaks = 'encoded';
        tk.setOptions(tkOptions);
        tk.redoLayout();
        result.setCursorToPageBeginning = true;
        if (result.xmlId && !result.speedMode) {
          result.pageNo = parseInt(tk.getPageWithElement(result.xmlId));
          result.forceUpdate = true;
        }
        if (result.xmlId) result.setCursorToPageBeginning = false;
        let pg = (result.speedMode && result.pageNo > 1) ? 2 : result.pageNo;
        result.svg = tk.renderToSVG(pg);
        result.pageCount = tk.getPageCount();
        result.cmd = 'updated';
      } catch (err) {
        log(err);
      };
      break;
    case 'updateOption': // just update option without redoing layout
      try {
        tkOptions = result.options;
        if (result.speedMode && result.breaks != 'none')
          tkOptions.breaks = 'encoded';
        tk.setOptions(tkOptions);
        result.setCursorToPageBeginning = true;
        if (result.xmlId && !result.speedMode) {
          result.pageNo = parseInt(tk.getPageWithElement(result.xmlId));
          result.forceUpdate = true;
        }
        if (result.xmlId) result.setCursorToPageBeginning = false;
        let pg = (result.speedMode && result.pageNo > 1) ? 2 : result.pageNo;
        result.svg = tk.renderToSVG(pg);
        result.pageCount = tk.getPageCount();
        result.cmd = 'updated';
      } catch (err) {
        log(err);
      };
      break;
    case 'importData': // all non-MEI formats
      try {
        tk.setOptions({
          inputFrom: result.format
        })
        let r = tk.loadData(result.mei);
        if (!r) {
          result.cmd = 'error';
          result.msg = 'Cannot import data.';
          break;
        }
        result = {
          'cmd': 'mei',
          'mei': tk.getMEI(),
          'pageCount': tk.getPageCount()
        };
        if (tkOptions) tk.setOptions(tkOptions);
      } catch (err) {
        log(err);
      }
      break;
    case 'importBinaryData': // compressed XML format
      console.log('importBinaryData ' +
        result.mei.byteLength + ' / ', result.mei);
      try {
        tk.setOptions({
          inputFrom: result.format
        })
        // tk.loadZipDataBase64(result.mei);
        let r = tk.loadZipDataBuffer(result.mei, result.mei.byteLength);
        if (!r) {
          result.cmd = 'error';
          result.msg = 'Cannot import compressed data.';
          break;
        }
        result = {
          'cmd': 'mei',
          'mei': tk.getMEI(),
          'pageCount': tk.getPageCount()
        };
        if (tkOptions) tk.setOptions(tkOptions);
      } catch (err) {
        log(err);
      }
      break;
    case 'reRenderMei':
      try {
        let r = tk.loadData(result.mei);
        if (!r) {
          result.cmd = 'error';
          result.msg = 'Cannot load MEI data.';
          break;
        }
        result.setCursorToPageBeginning = true;
        if (result.xmlId && !result.removeIds) {
          result.pageNo = parseInt(tk.getPageWithElement(result.xmlId));
          result.setCursorToPageBeginning = false;
        }
        result.svg = tk.renderToSVG(result.pageNo);
        result.pageCount = tk.getPageCount();
        if (result.removeIds) result.mei = tk.getMEI({
          'removeIds': result.removeIds
        })
        else result.mei = tk.getMEI();
        result.cmd = 'updated';
      } catch (err) {
        log(err);
      }
      break;
    case 'navigatePage': // for a page turn during navigation
      try { // returns original message plus svg
        if (result.speedMode) {
          tk.setOptions({
            breaks: 'encoded'
          });
          tk.loadData(result.mei);
          result.mei = '';
        }
        let pg = (result.speedMode && result.pageNo > 1) ? 2 : result.pageNo;
        result.svg = tk.renderToSVG(pg);
      } catch (err) {
        log(err);
      }
      break;
    case 'computePageBreaks': // compute page breaks
      try {
        // console.log('Worker computePageBreaks started');
        tkOptions = result.options;
        tk.setOptions(tkOptions);
        tk.loadData(result.mei);
        result.pageCount = tk.getPageCount();
        result.pageBreaks = {};
        for (let p = 1; p <= result.pageCount; p++) { // one-based page numbers
          updateProgressbar(p / result.pageCount * 100);
          // console.log('Progress: ' + p / result.pageCount * 100 + '%')
          let svgText = tk.renderToSVG(p);
          let it = svgText // find all measures
            .matchAll(/g([^>]+)(?:class=)(?:['"])(?:measure|system)(?:['"])/g);
          let j = -1; // breaks within a page
          let breaks = [];
          for (let i of it) {
            // console.info('worker:computePageBreaks: ' + String(i[0]));
            if (i[0].includes('system')) j++;
            breaks[j] = String(i[1])
              .match(/(['"])[^'"]*\1/)[0].replace(/['"]/g, '');
          }
          result.pageBreaks[p] = breaks;
        }
        // console.log('Worker computePageBreaks: ', result.pageBreaks);
      } catch (err) {
        log(err);
      }
      break;
    case 'exportMidi': // re-load data and export MIDI base-64 string
      try { //
        tkOptions = result.options;
        tk.setOptions(tkOptions);
        tk.loadData(result.mei);
        result.midi = tk.renderToMIDI();
        result.cmd = 'midi';
      } catch (err) {
        log(err);
      }
      break;
    case 'getTimeForElement':
      try {
        result = {
          'cmd': 'timeForElement',
          'msg': tk.getTimeForElement(result.mei)
        };
      } catch (err) {
        log(err);
      }
      break;
    case 'getPageWithElement':
      try {
        result = {
          'cmd': 'pageWithElement',
          'msg': tk.getPageWithElement(result.msg)
        };
      } catch (err) {
        log(err);
      }
      break;
    case 'getElementAttr':
      try {
        result = {
          'cmd': 'elementAttr',
          'msg': tk.getElementAttr(result.mei)
        };
      } catch (err) {
        log(err);
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

function updateProgressbar(perc) {
  postMessage({
    'cmd': 'updateProgressbar',
    'percentage': perc
  });
}