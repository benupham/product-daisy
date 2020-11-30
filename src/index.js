import * as d3 from 'd3';
import * as d3plus from 'd3plus-text';
import { forceAttract } from 'd3-force-attract';
import {forceCluster} from 'd3-force-cluster';
d3.forceAttract = forceAttract;
d3.forceCluster = forceCluster;

import {click, labelsArray} from './click';
import {zoom, transform, zoomToBounds} from './zoom';
import { textFormatter } from './utilities';
import { imageSize, imagePosition, nameFontSize, nameAnchor, nameAlignment, namePosition, strokeColor, imagesURL, rectPosition, rectFill, rectSize, rectFilter, nameWidth, nameMaxLen, typePixelSize } from './constants';
import { grid } from './groupToGrid';
import { GRID_WIDTH, GRID_UNIT_SIZE, GRID_HEIGHT } from './constants';
import { wrapNames } from './sizeText';
import { onMouseOver} from './devTools';

import './styles/style.css';
import { addImages, addName, styleRectWrap } from './svgStyles';

export const depts = [];
export const subdepts = [];
export const brands = [];
export const products = [];
export let items = [];
export let itemsByGroup = [];

// The container for all the action.
export const svg = d3.select("body").append("svg")
  .attr("class", "main")
  .attr("width", window.innerWidth)
  .attr("height", window.innerHeight)
  .call(zoom);

// The <g> element that does the zooming.
export const zoomable = svg  
  .append("g")
  .attr("class", "zoomable");

svg.call(zoom.transform, transform);  
  
let node = zoomable.selectAll('g.node'); 


// Create nested objects for each product and dept in product set
d3.json("../data/productSet.json", function(error, root) {

  root.forEach(d => {
    d.open = false; 
    if (d.type === 'dept') {
      depts.push(d);
    } else if (d.type === 'subdept') {  
      subdepts.push(d);
    } else if (d.type === 'brand') {
      brands.push(d);
    } else if (d.type === 'product') {
      products.push(d);
    }
  });

  appInit();

})

function appInit() {
  // Create the initial list of nodes
  items = depts;
  itemsByGroup.push(depts);

  // Start the departments at grid center
  depts.forEach( d=> {
    d.x = GRID_WIDTH * GRID_UNIT_SIZE/2;
    d.y = GRID_HEIGHT * GRID_UNIT_SIZE/2;
  });

  // Create the grid and zoom to it.
  grid.init();
  grid.snapToGrid(items);
  zoomToBounds(grid.itemsGridBounds);
  // Arrange and style nodes on grid
  update();
  
}

// Start or restart rendering of svgs    
export function update() {
  
  wrapNames(items);

  node = node.data(items, function(d) { return d.id;})
  
  node.classed("latest", false);

  node.exit()
    .remove();

  // Enter any new items.
  var nodeEnter = node.enter().append("g")
    .attr("class", d => d.type + " node latest")
    .attr("name", function (d) { return d.name; })

  // Append a rectangle background
  styleRectWrap(nodeEnter);
  // Append images
  addImages(nodeEnter);

  addName(nodeEnter);

 
  
  // Append stars rating for products
  nodeEnter.filter(d => d.type === "product")
    .append("image") 
    .attr("xlink:href", imagesURL + "category-images/four-and-half-stars.png")
    .attr("class", "stars")
    .attr("x", d => namePosition[d.type][0])
    .attr("y", d => {
      return namePosition[d.type][1] + nameFontSize[d.type]*4.5
    })
    .attr("height", 25 ) 
  
  // Append buy button  
  nodeEnter.filter(d => d.type === "product")
    .append("rect")
    .attr("class", "buy-button")
    .attr("fill", "url(#lgrad)")
    .attr("rx", "2")
    .attr("stroke", "#a88734")
    .attr("width", 156)
    .attr("height", 40)
    .attr("x", d => namePosition[d.type][0])
    .attr("y", d => {
      return namePosition[d.type][1] + nameFontSize[d.type]*6.5
    })
  // Buy button label
  nodeEnter.filter(d => d.type === "product")
    .append("text")
    .text("Add to Cart")
    .attr("x", 97.5)
    .attr("y", 365)
    .attr("text-anchor", "middle")
    .attr('fill', '#111111')
    .attr("font-size", 16)
  
  // nodeEnter
    // .attr("transform", function (d) { return "translate(" + d.ix + "," + d.iy + ") scale(.25)"; });
  
  node = nodeEnter
    .merge(node)
  
  let t = d3.transition()
  .duration(250);  

  node
    // .transition(t)  
    .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ") scale(1)"; })

 
  
  // slowly fades the glow on the most recently added items  
  document.getElementById("fade-to-grey").beginElement();
  document.getElementById("shrink").beginElement();

  node.on("click",click);

  
}  


