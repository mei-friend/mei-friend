const svgNS = "http://www.w3.org/2000/svg";
import {
  navElsSelector
} from './dom-utils.js';

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
    v.selectedElements.forEach(el => oldEls.push(el));
    start.x = ev.clientX;
    start.y = ev.clientY;
    rect = document.createElementNS(svgNS, 'rect');
    document.querySelector('g.page-margin').appendChild(rect);

    var svgEls = document.querySelectorAll('g .note, .rest, .mRest, .beatRpt, .halfmRpt, .mRpt');
    svgEls.forEach(el => {
      let bb = el.getBBox();
      if (Object.keys(obobj).includes(Math.round(bb.x * 1000)) &&
        Object.keys(obobj[Math.round(bb.x * 1000)]).includes(Math.round(bb.y * 1000))) {
        obobj[Math.round(bb.x * 1000)][Math.round(bb.y * 1000)].push(el);
      } else {
        obobj[Math.round(bb.x * 1000)] = {};
        obobj[Math.round(bb.x * 1000)][Math.round(bb.y * 1000)] = [el];
      }
      // if (Object.keys(obobj).includes(bb.x + bb.width) &&
      //   Object.keys(obobj[bb.x + bb.width]).includes(bb.y + bb.height)) {
      //   obobj[bb.x + bb.width][bb.y + bb.height].push(el);
      // } else {
      //   obobj[bb.x + bb.width] = {};
      //   obobj[bb.x + bb.width][bb.y + bb.height] = [el];
      // }
    });
    let asdf = 123123;
  });

  vp.addEventListener('mousemove', ev => {
    if (clicked) {
      newEls = [];
      end.x = ev.clientX;
      end.y = ev.clientY;
      var mx = document.querySelector('g.page-margin').getScreenCTM().inverse();
      // var mx = document.querySelector('.verovio-panel svg').getScreenCTM().inverse();
      let s = transformCTM(start, mx);
      let e = transformCTM(end, mx);
      let x = s.x;
      let width = Math.abs(e.x - s.x);
      let y = s.y;
      let height = Math.abs(e.y - s.y);
      if (e.x < s.x) x = e.x;
      if (e.y < s.y) y = e.y;

      updateRect(rect, x, y, width, height, 'var(--notationColor)');
      console.log('Mouse move: x/y: ' + x + '/' + y + ', w/h' + width + '/' + height);

      let selX = Object.keys(obobj)
        .filter(kx => parseFloat(kx) > Math.round(x * 1000) && parseFloat(kx) < Math.round((x + width) * 1000));
      let selY = selX.map(keyX => Object.keys(obobj[keyX]))
        .filter(ky => parseFloat(ky) > Math.round(y * 1000) && parseFloat(ky) < Math.round((y + height) * 1000));

      if (selX.length > 0 && selY.length > 0) {
        selX.forEach((keyX, xi) => {
          let ys = selY[xi];
          if (ys) ys.forEach(keyY => {
            let els = obobj[keyX][keyY];
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
