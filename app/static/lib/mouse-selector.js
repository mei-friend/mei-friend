const svgNS = "http://www.w3.org/2000/svg";
import {
  navElsSelector
} from './dom-utils.js';

export function addMouseSelector(v, vp) {

  let clicked = false;

  // object storing x, y coordinates of svg elements
  var svgEls = document.querySelectorAll('g ' + navElsSelector);

  var start = {};
  var end = {};

  var rect;

  vp.addEventListener('mousedown', ev => {
    clicked = true;
    if (!((navigator.appVersion.indexOf("Mac") !== -1) && ev.metaKey) && !ev.ctrlKey) {
      v.selectedElements = [];
      v.updateHighlight();
    }
    start.x = ev.clientX;
    start.y = ev.clientY;
    rect = document.createElementNS(svgNS, 'rect');
    document.querySelector('g.page-margin').appendChild(rect);
  });

  vp.addEventListener('mousemove', ev => {
    if (clicked) {
      console.log('Mouse move: x/y: ' + ev.clientX + '/' + ev.clientY + ', ', ev);
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
