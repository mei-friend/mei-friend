const svgNS = "http://www.w3.org/2000/svg";

export function addMouseSelector(v, cm, vp) {

  let clicked = false;

  // object storing x, y coordinates of svg elements
  var obobj = {};
  let oldEls = [];
  let newEls = [];
  var start = {};
  var end = {};
  var rect;

  vp.addEventListener('mousedown', ev => {
    clicked = true;
    // clear selected elements, if no CMD/CTRL key is pressed
    if (!((navigator.appVersion.indexOf("Mac") !== -1) && ev.metaKey) && !ev.ctrlKey) {
      v.selectedElements = [];
      v.updateHighlight();
    }
    oldEls = [];
    obobj = {};
    v.selectedElements.forEach(el => oldEls.push(el)); // remember selected els
    // create selection rectangle
    rect = document.createElementNS(svgNS, 'rect');
    let svgPm = document.querySelector('g.page-margin');
    svgPm.appendChild(rect);
    // remember click point
    start.x = ev.clientX;
    start.y = ev.clientY;

    var svgEls = document.querySelectorAll(
      'g .note, .rest, .mRest, .beatRpt, .halfmRpt, .mRpt');
    svgEls.forEach(el => {
      let bb = el.getBBox();
      if (Array.from(el.classList).includes('note'))
        bb = el.querySelector('.notehead').getBBox();
      let x = Math.round(bb.x * 1000);
      let y = Math.round(bb.y * 1000);
      if (!Object.keys(obobj).includes(x.toString())) obobj[x] = {};
      if (Object.keys(obobj).includes(x.toString()) &&
        Object.keys(obobj[x]).includes(y.toString())) {
        obobj[x][y].push(el);
      } else {
        obobj[x][y] = [el];
      }
      // DEBUG: add bounding boxes to notation
      // rect = document.createElementNS(svgNS, 'rect');
      // updateRect(rect, bb.x, bb.y, bb.width, bb.height, 'crimson');
      // svgPm.appendChild(rect);
      // let txt = document.createElementNS(svgNS, 'text');
      // txt.setAttribute('x', bb.x);
      // txt.setAttribute('y', bb.y);
      // txt.setAttribute('font-size', '160pt');
      // txt.setAttribute('fill', 'red');
      // txt.textContent = Math.round(bb.x) + '/' + Math.round(bb.y);
      // svgPm.appendChild(txt);

      // let x2 = Math.round((bb.x + bb.width) * 1000);
      // let y2 = Math.round((bb.y + bb.height) * 1000);
      // if (Object.keys(obobj).includes(x2) && Object.keys(obobj[x2]).includes(y2)) {
      //   obobj[x2][y2].push(el);
      // } else {
      //   obobj[x2] = {};
      //   obobj[x2][y2] = [el];
      // }
    });
  });

  vp.addEventListener('mousemove', ev => {
    if (clicked) {
      newEls = [];
      end.x = ev.clientX;
      end.y = ev.clientY;
      var mx = document.querySelector('g.page-margin').getScreenCTM().inverse();
      // transform mouse/screen coordinates to SVG coordinates
      let s = transformCTM(start, mx);
      let e = transformCTM(end, mx);
      let x = s.x;
      let width = Math.abs(e.x - s.x);
      let y = s.y;
      let height = Math.abs(e.y - s.y);
      if (e.x < s.x) x = e.x;
      if (e.y < s.y) y = e.y;

      updateRect(rect, x, y, width, height, 'var(--notationColor)');
      // console.log('Mouse move: x/y: ' + x + '/' + y + ', w/h' + width + '/' + height);

      let xx = Math.round(x * 1000);
      let xx2 = Math.round((x + width) * 1000);
      let yy = Math.round(y * 1000);
      let yy2 = Math.round((y + height) * 1000);
      let selX = Object.keys(obobj)
        .filter(kx => (parseInt(kx) >= xx && parseInt(kx) <= xx2));
      if (selX.length > 0) {
        selX.forEach(xKey => {
          let yKeys = Object.keys(obobj[xKey])
            .filter(ky => (parseInt(ky) >= yy && parseInt(ky) <= yy2));
          if (yKeys) yKeys.forEach(yKey => {
            let els = obobj[xKey][yKey];
            if (els) els.forEach(e => {
              if (!newEls.includes(e.id))
                newEls.push(e.id);
            });
          });
        });
      }
      console.log('selected elements: ', newEls);
      v.selectedElements = [];
      oldEls.forEach(el => v.selectedElements.push(el));
      newEls.forEach(el => v.selectedElements.push(el));
      v.updateHighlight(cm);
    }
  });

  vp.addEventListener('mouseup', ev => {
    clicked = false;
    document.querySelector('g.page-margin').removeChild(rect);
  });

}

function transformCTM(point, matrix) {
  let r = {};
  r.x = matrix.a * point.x + matrix.c * point.y + matrix.e;
  r.y = matrix.b * point.x + matrix.d * point.y + matrix.f;
  return r;
}

function updateRect(rect, x, y, width, height, color = "black", strokeWidth = 4) {
  rect.setAttribute('x', x);
  rect.setAttribute('y', y);
  rect.setAttribute('width', width);
  rect.setAttribute('height', height);
  rect.setAttribute('stroke-width', strokeWidth);
  rect.setAttribute('stroke', color);
  rect.setAttribute('fill', 'none');
}
