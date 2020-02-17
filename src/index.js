import * as d3 from 'd3';
import * as d3plus from 'd3plus-text';
import { forceAttract } from 'd3-force-attract';
import {forceCluster} from 'd3-force-cluster';
d3.forceAttract = forceAttract;
d3.forceCluster = forceCluster;

import {click, labelsArray} from './click';
import {zoom} from './zoom';
import { textFormatter } from './utilities';
import { imageSize, imagePosition, nameFontSize, nameAnchor, nameAlignment, namePosition, strokeColor, imagesURL, rectPosition, rectFill, rectSize, rectFilter, nameWidth, nameMaxLen, typePixelSize } from './constants';
import { grid } from './snapToGrid';
import { GRID_WIDTH, GRID_UNIT_SIZE, GRID_HEIGHT } from './constants';
import { wrapNames } from './sizeText';

import './styles/style.css';

export const depts = [];
export const subdepts = [];
export const brands = [];
export const products = [];
export let items = [];

export const width = GRID_WIDTH * GRID_UNIT_SIZE;
export const height = GRID_HEIGHT * GRID_UNIT_SIZE;
const zoomWidth = -(GRID_WIDTH * GRID_UNIT_SIZE/2);
const zoomHeight = -(GRID_HEIGHT * GRID_UNIT_SIZE/2);



// Add SVG canvas and zoom effect
export const svg = d3.select("body").append("svg")
  .attr("width", "100%")
  .attr("height", "100%")
  .call(zoom)
  .append("g")
  .attr("transform", "translate(" + zoomWidth + "," + zoomHeight + ")");

  
  // .attr("transform", "translate(" + zoomWidth + "," + zoomHeight + ")")

var node = svg.selectAll('g.node'); 

// Create nested objects for each product and dept in product set
d3.json("../data/productSet.json", function(error, root) {
  console.log('root',root)

  root.forEach(d => {
    d.radius = imageSize[d.type]/2 * Math.SQRT2;
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


  depts.forEach( d=> {
    d.x = width/2;
    d.y = height/2;
  });
  items = depts;
  console.log('items',items)
  update();

})

// Start or restart     
export function update() {
  grid.init();

  let t = d3.transition()
  .duration(500);
  
  items.forEach(d => grid.snapToGrid(d));
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
  nodeEnter.append("rect")
    .attr("name", function (d) { return d.name; })
    .attr("class", "wrap")
    .attr("x", d => rectPosition[d.type][0])
    .attr("y", d=> rectPosition[d.type][1])
    .attr("fill", d => rectFill[d.type])
    .attr("fill-opacity", 1)
    .attr("stroke", d => strokeColor[d.type])
    //.transition(t)
    .attr("height", d => rectSize[d.type][1]) 
    .attr("width", d => rectSize[d.type][0])

  // Append images
  nodeEnter.append("image")
    .attr("xlink:href", function (d) { return imagesURL + (d.img || "product-images/missing-item.jpg"); })
    .attr("name", function (d) { return d.name; })
    .attr("class", "item-image")
    .attr("x", d => imagePosition[d.type][0])
    .attr("y", d => imagePosition[d.type][1])
    // .transition(t)
    .attr("height", d => imageSize[d.type] ) 
    .attr("width", d => imageSize[d.type])
    .attr("alignment-baseline", "middle")

  // Append name 
  var nodeEnterText = nodeEnter.append("text")
    .attr("class", "name name-line1")
    .attr("text-anchor", d => nameAnchor[d.type])
    .attr("alignment-baseline", d => d.nameWrap.lines.length > 1 ? "start" : "middle")
    .attr("x", d => namePosition[d.type][0])
    .attr("y", d => d.nameWrap.lines.length > 1 ? namePosition[d.type][1] - nameFontSize[d.type]/5 : namePosition[d.type][1])
    .attr("font-size", d => nameFontSize[d.type])
    .attr("fill", "#464646")
    .text(d =>  d.nameWrap.lines[0]);
    
  nodeEnterText.filter(d => d.nameWrap.lines[1])
    .append("tspan")
    .attr("class", "name name-line2")
    .attr("x", d => namePosition[d.type][0])
    .attr("y", d => namePosition[d.type][1] + nameFontSize[d.type])
    .text(d =>  d.nameWrap.lines[1]);
  
  // Append price for products 
  nodeEnterText.filter(d => d.type === "product")
    .append("tspan")
    .text(d =>  d.price)  
    .attr("class", "price")
    .attr("font-size", nameFontSize["product"])
    .attr("fill", "#B12704")
    .attr("x", d => namePosition[d.type][0])
    .attr("dy", d => nameFontSize[d.type]*3);
  
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

  node = nodeEnter
    .merge(node)
  
  node
    .transition(t)  
    .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });
  
  // slowly fades the glow on the most recently added items  
  document.getElementById("fade-to-grey").beginElement();
  document.getElementById("shrink").beginElement();

  node.on("click",click);
  
}  


