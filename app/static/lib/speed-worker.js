// worker to pre-compute information for accelerating speedMode


// let message = {
// cmd: 'listPageSpanningElements',
// 'xmlDoc': this.xmlDoc,
// 'breaks': this.breaks,
// 'breaksOption': bs.value
// };

onmessage = function(e) {
  let result = {};
  console.info("SpeedWorker received: " + e.data.cmd + ', ', e.data);
  switch (result.cmd) {
    case 'listPageSpanningElements':
      result.cmd = 'listPageSpanningElements'
      result.pageSpanners =
        listPageSpanningElements(e.data.xmlDoc, e.data.breaks, e.data.breaksOption);
      break;
  }
  if (result) postMessage(result);
}

// list all timespanning elements with @startid/@endid attr on different pages
function listPageSpanningElements(xmlScore, breaks, breaksOption) {
  let t1 = performance.now();
  let els = xmlScore.querySelectorAll(att.timeSpanningElements.join(','));
  let pageSpanners = {
    start: {},
    end: {}
  };
  // for breaks encoded / array; TODO auto/Object
  let sel = '';
  switch (breaksOption) {
    case 'none':
      return {};
    case 'auto':
      if (Object.keys(breaks).length > 0) {
        for (let pg in breaks) {
          let br = breaks[pg]; // array of breaks
          sel += '[*|id="' + br[br.length - 1] + '"],';
        }
      } else return {};
      break;
    case 'line':
      sel = 'pb,sb,'
      break;
    case 'encoded':
      sel = 'pb,';
  }
  // object with time-spanning-element-ids key: [@startid,@endid] array
  let tsTable = {};
  for (let el of els) {
    let id = el.getAttribute('xml:id');
    let startid = rmHash(el.getAttribute('startid'));
    if (startid) sel += '[*|id="' + startid + '"],';
    let endid = rmHash(el.getAttribute('endid'));
    if (endid) sel += '[*|id="' + endid + '"],';
    if (id && startid && endid) tsTable[id] = [startid, endid];
  }
  let t2 = performance.now();
  console.log('listPageSpanningElements selector preps: ' + (t2 - t1) + ' ms.');

  let elList = xmlScore.querySelectorAll(sel.slice(0, -1));

  t1 = t2;
  t2 = performance.now();
  console.log('listPageSpanningElements querySelectorAll: ' + (t2 - t1) + ' ms.');

  let noteTable = {};
  let count = false;
  let p = 1;
  if (breaksOption == 'line' || breaksOption == 'encoded') {
    for (let e of elList) {
      if (breaks.includes(e.nodeName)) count = true;
      if (count && breaks.includes(e.nodeName)) p++;
      else
        noteTable[e.getAttribute('xml:id')] = p;
    }
  } else if (breaksOption = 'auto') {
    let m;
    for (let e of elList) {
      if (e.nodeName === 'measure') {
        p++;
        m = e;
      } else {
        noteTable[e.getAttribute('xml:id')] =
          (m && e.closest('measure') == m) ? p - 1 : p;
      }
    }
  }

  t1 = t2;
  t2 = performance.now();
  console.log('listPageSpanningElements noteTable: ' + (t2 - t1) + ' ms.');

  let p1 = 0;
  let p2 = 0;
  for (let spannerIds of Object.keys(tsTable)) {
    p1 = noteTable[tsTable[spannerIds][0]];
    p2 = noteTable[tsTable[spannerIds][1]];
    if (p1 > 0 && p2 > 0 && p1 != p2) {
      if (pageSpanners.start[p1])
        pageSpanners.start[p1].push(spannerIds);
      else
        pageSpanners.start[p1] = [spannerIds];
      if (pageSpanners.end[p2])
        pageSpanners.end[p2].push(spannerIds);
      else
        pageSpanners.end[p2] = [spannerIds];
    }
  }

  t1 = t2;
  t2 = performance.now();
  console.log('listPageSpanningElements pageSpanners: ' + (t2 - t1) + ' ms.');

  return pageSpanners;
}
