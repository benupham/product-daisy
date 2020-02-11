import * as d3 from 'd3';
import {svg, g, nodes} from './index';

export const zoom = d3.zoom()
.scaleExtent([0.01,10])
.on("zoom", zoomed);  

function zoomed() {
  console.log(d3.event.transform)
  console.log(d3.event.transform.translate(-15000, -15000))
  let transform = d3.event.transform
  svg.attr("transform", d3.event.transform.translate(-15000,-15000));



  let zoomMeter = document.getElementById("zoomMeter");
  zoomMeter.innerHTML = "zoom: " + d3.event.transform.k;
}  


