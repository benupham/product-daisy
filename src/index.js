import * as d3 from 'd3';
import { forceAttract } from 'd3-force-attract';
import {forceCluster} from 'd3-force-cluster';
d3.forceAttract = forceAttract;
d3.forceCluster = forceCluster;

import {click, labelsArray} from './click';
import {zoom} from './zoom';
import { textFormatter } from './utilities';
import { imageSize, imagePosition, fontSize, textAnchor, textPosition, strokeColor, imagesURL, rectPosition, rectFill, rectSize, rectFilter } from './constants';
import { grid } from './snapToGrid';
import { GRID_WIDTH, GRID_UNIT_SIZE, GRID_HEIGHT } from './constants';

import './styles/style.css';

export const depts = [];
export const subdepts = [];
export const brands = [];
export const products = [];
export let nodes = [];

export const width = GRID_WIDTH * GRID_UNIT_SIZE;
export const height = GRID_HEIGHT * GRID_UNIT_SIZE;
const scale = .2;
const zoomWidth = -width/2;
const zoomHeight = -height/2;
console.log('zoomWidth', zoomWidth)


// Add SVG canvas and zoom effect
export const svg = d3.select("body").append("svg")
.attr("width", width)
.attr("height", height)
.call(zoom)
.attr("transform", "translate(" + zoomWidth + "," + zoomHeight + ")" )
.append("g");

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
  nodes = depts;
  console.log('nodes',nodes)
  update();

})

// Start or restart     
export function update() {
  grid.init();

  let t = d3.transition()
  .duration(500);
  
  nodes.forEach(d => grid.snapToGrid(d));
  node = node.data(nodes, function(d) { return d.id;})
  
  node.exit()
    .remove();

  // Enter any new nodes.
  var nodeEnter = node.enter().append("g")
    .attr("class", "node")
    .attr("class", d => d.type)
    .attr("name", function (d) { return d.name; })
    //.style("font-family", "Lato, Roboto, Arial, Helvetica, sans-serif")

  // Append a rectangle background
  nodeEnter.append("rect")
    .attr("name", function (d) { return d.name; })
    .attr("class", "wrap")
    .attr("x", d => rectPosition[d.type][0])
    .attr("y", d=> rectPosition[d.type][1])
    .attr("fill", d => rectFill[d.type])
    .attr("fill-opacity", 1)
    .attr("stroke", d => strokeColor[d.type])
    .transition(t)
    .attr("height", d => rectSize[d.type][1]) 
    .attr("width", d => rectSize[d.type][0])
    .style("filter", d => rectFilter[d.type])


  // Append images
  nodeEnter.append("image")
    .attr("xlink:href", function (d) { return imagesURL + (d.img || "product-images/missing-item.jpg"); })
    .attr("name", function (d) { return d.name; })
    .attr("x", d => imagePosition[d.type][0])
    .attr("y", d => imagePosition[d.type][1])
    .transition(t)
    .attr("height", d => imageSize[d.type] ) 
    .attr("width", d => imageSize[d.type])
    .attr("alignment-baseline", "middle")

  // Append title 
  var nodeEnterText = nodeEnter.append("text")
    .attr("text-anchor", d => textAnchor[d.type])
    .attr("x", d => textPosition[d.type][0])
    .attr("y", d => textPosition[d.type][1])
    .attr("font-size", d => fontSize[d.type])
    .attr("fill", "#464646");

  nodeEnterText.append("tspan")
    .attr("class", "name name-line1")
    .text(d =>  textFormatter(d.name, 25, 50)[0])
    
  nodeEnterText.append("tspan")
    .attr("class", "name name-line2")
    .text(d =>  textFormatter(d.name, 25, 50)[1])
    .attr("x", d => textPosition[d.type][0])
    .attr("dy", d => fontSize[d.type]*1.1)
  
  // Append price for products 
  nodeEnterText.append("tspan")
    .text(d =>  d.price)  
    .attr("class", "price")
    .attr("font-size", 16)
    .attr("fill", "#B12704")
    .attr("x", d => textPosition[d.type][0])
    .attr("dy", d => fontSize[d.type]*4);
  
  // Append stars rating for products
  nodeEnter.filter(d => d.type === "product")
    .append("image") 
    .attr("xlink:href", imagesURL + "category-images/four-and-half-stars.png")
    .attr("name", "stars")
    .attr("x", d => textPosition[d.type][0])
    .attr("y", d => {
      return textFormatter(d.name, 25, 50)[1].length > 0 ? textPosition[d.type][1] + fontSize[d.type]*1.75 : textPosition[d.type][1] + fontSize[d.type]*0.75
    })
    .attr("height", 15 ) 
    .attr("width", 80)
  
  // Append buy button  
  nodeEnter.filter(d => d.type === "product")
    .append("rect")
    .attr("class", "buy-button")
    .attr("fill", "url(#lgrad)")
    .attr("rx", "2")
    .attr("stroke", "#a88734")
    .attr("width", d => imageSize[d.type])
    .attr("height", 30)
    .attr("x", d => textPosition[d.type][0])
    .attr("y", d => {
      return textPosition[d.type][1] + fontSize[d.type]*6
    })
  // Buy button label
  nodeEnter.filter(d => d.type === "product")
    .append("text")
    .text("Add to Cart")
    .attr("x", d => imageSize[d.type]/2)
    .attr("y", d => {
      return textPosition[d.type][1] + fontSize[d.type]*6.5 + 15
    })
    .attr("text-anchor", "middle")
    .attr('fill', '#111111')
    .attr("font-size", 16)

  node = nodeEnter
    .merge(node)
  
  node
    .transition(t)  
    .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });
  
  node.on("click",click);
  
}  


