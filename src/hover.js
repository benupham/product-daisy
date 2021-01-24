import {depts,subdepts,brands,products, items, update, svg, zoomable, zoom, itemsByGroup, closeBtn} from './index';
import {grid} from './groupToGrid';
import { zoomIdentity } from 'd3';
import { clickTracker } from './devTools';
import { zoomToBounds } from './zoom';

function positionCloseBtn() {

}

export function hovering() {
  // document.getElementById("close-button")
}

export function handleHover(d) {
  const htmlCloseBtn = document.querySelector('#close-button');

  console.log(htmlCloseBtn)
  console.log(d);

  let leftCorner = d.groupBounds[0];

  //let screenCoord = SVGToScreen(leftCorner[0], leftCorner[1]);

  // console.log('screenCoord', screenCoord);
  // console.log('leftcorner', leftCorner);
  // htmlCloseBtn.style.top = screenCoord.x +"px";
  // htmlCloseBtn.style.left = screenCoord.y +"px";
  closeBtn.attr("cx", leftCorner[0]).attr("cy", leftCorner[1]);

}
// then set up listener for pointer movement
// get pointer position on the canvas x/y
// debounce the listener callback 


function SVGToScreen(svgX, svgY) {
  console.log('zoomable node',zoomable.node());
  var p = zoomable.createSVGPoint();
   p.x = svgX
   p.y = svgY
   return p.matrixTransform(zoomable.node().getScreenCTM());
}