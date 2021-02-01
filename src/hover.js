import {depts,subdepts,brands,products, items, update, svg, zoomable, zoom, itemsByGroup} from './index';
import { removeDescendants } from './click';
import {grid} from './groupToGrid';
import { zoomIdentity } from 'd3';
import { clickTracker } from './devTools';
import { zoomToBounds } from './zoom';

let closeBtn = null;

export function createControls(zoomable) {
  closeBtn = zoomable.append("circle")
  .attr("r", 20)
  .attr("stroke", "blue")
  .attr("stroke-width", 2)
  .attr("fill", "white")
  .attr("cx", -99999).attr("cy", -99999);
}
  


function positionCloseBtn() {

}

export function hovering() {
  // document.getElementById("close-button")
}

export function handleHover(d) {

  const htmlCloseBtn = document.querySelector('#close-button');

  // console.log('close button',htmlCloseBtn)
  // console.log(d);

  const leftCorner = d.groupGridBounds[0];
  if (leftCorner) {
    closeBtn
    .raise()
    .attr("cx", leftCorner[0]).attr("cy", leftCorner[1])
    .on("click", function(e, btn) {
      console.log('event', e)
      console.log('button', btn)
      const parent = items.find(p => p.id === d.parent);
      console.log(parent)
      removeDescendants(parent);
      closeBtn.attr("cx", -99999).attr("cy", -99999);
      update();
    });
  }
  

}

function removeGroup(d) {
  console.log(d);
}

function SVGToScreen(svgX, svgY) {
  console.log('zoomable node',zoomable.node());
  var p = svg.node().createSVGPoint();
   p.x = svgX
   p.y = svgY
   return p.matrixTransform(zoomable.node().getScreenCTM());
}