const svgNS = "http://www.w3.org/2000/svg";
import {
  navElsSelector
} from './dom-utils.js';

export function addMouseSelector(v, cm, vp) {

  let clicked = false;

  // object storing x, y coordinates of svg elements
  var obobj = {};

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
    start.x = ev.clientX;
    start.y = ev.clientY;
    rect = document.createElementNS(svgNS, 'rect');
    document.querySelector('g.page-margin').appendChild(rect);

    var svgEls = document.querySelectorAll('g .note, .rest, .mRest, .beatRpt, .halfmRpt, .mRpt');
    svgEls.forEach(el => {
      let bb = el.getBBox();
      if (Object.keys(obobj).includes(bb.x) &&
        Object.keys(obobj[bb.x]).includes(bb.y)) {
        obobj[bb.x][bb.y].push(el);
      } else {
        obobj[bb.x] = {};
        obobj[bb.x][bb.y] = [el];
      }
    });
    let asdf = 123123;
  });

  vp.addEventListener('mousemove', ev => {
    if (clicked) {
      end.x = ev.clientX;
      end.y = ev.clientY;
      var mx = document.querySelector('g.page-margin').getScreenCTM().inverse();
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

      let selX = Object.keys(obobj).filter(kx => kx > x && kx < x + width);
      let selY = selX.map(keyX => Object.keys(obobj[keyX])).filter(ky => ky > y && ky < y + height);
      if (selX.length > 0 && selY.length > 0) {

        selX.forEach((keyX, xi) => {
          let ys = selY[xi];
          if (ys) ys.forEach(keyY => {
            let els = obobj[keyX][keyY];
            if (els) els.forEach(e => {
              if (!v.selectedElements.includes(e.id))
                v.selectedElements.push(e.id);
            });
          });
        });
      }
      console.log('selected elements: ', v.selectedElements);
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
