import * as d3 from 'd3';
import { zoomMeter } from './devTools';
import {svg, zoomable} from './index';
import { GRID_WIDTH, GRID_UNIT_SIZE, GRID_HEIGHT } from './constants';

const initialScale = 0.5
const zoomWidth = -((GRID_WIDTH * GRID_UNIT_SIZE) * (1-initialScale)/2);
const zoomHeight = -((GRID_HEIGHT * GRID_UNIT_SIZE) * (1-initialScale)/2);


// Add zoom effect to SVG. The zoom effect and all 
// zoom transforms are added to the SVG, even though it is the 
// zoomable <g> element that actually does the zooming.
// The <g> element that zooms must be adjusted negatively 
// to align with the nodes which start centered in the grid. 
// see https://stackoverflow.com/a/46437252
export const transform = d3.zoomIdentity.translate(zoomWidth, zoomHeight).scale(initialScale);
export const zoom = d3.zoom().scaleExtent([0.01,10]).on("zoom", zoomed);  

function zoomed() {  
  if (zoomable){
    zoomable.attr("transform", d3.event.transform);

    // zoomMeter(d3.event.transform.k);
  }
} 
 
export function zoomToBounds(bounds) {

  const [[x0, y0], [x1, y1]] = bounds;
    
  // https://bl.ocks.org/iamkevinv/0a24e9126cd2fa6b283c6f2d774b69a2
  var dx = x1 - x0,
    dy = y1 - y0,
    x = (x0 + x1) / 2,
    y = (y0 + y1) / 2,
    scale = Math.min(0.9, Math.min(8, 0.9 / Math.max(dx / window.innerWidth, dy / window.innerHeight))),
    translate = [window.innerWidth / 2 - scale * x, window.innerHeight / 2 - scale * y];
  
  svg.transition().duration(750).call(
    zoom.transform,
    d3.zoomIdentity
      .translate(translate[0], translate[1]).scale(scale)
  );

}



// var svg = d3.select("body")
//   .append('svg')
//   .attr('width', 800)
//   .attr('height', 300)
//   .style("background", "red")
//   .call(zoom)                       // Adds zoom functionality
//   .call(zoom.transform, transform); // Calls/inits handleZoom

// var zoomable = svg
//   .append("g")
//   .attr("class", "zoomable")
//   .attr("transform", transform);    // Applies initial transform


// function handleZoom(){
//   if (zoomable) {
//     zoomable.attr("transform", d3.event.transform);
//   }
// };