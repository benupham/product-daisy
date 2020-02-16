import * as d3 from 'd3';
import * as d3plus from 'd3plus-text';
import { forceAttract } from 'd3-force-attract';
import {forceCluster} from 'd3-force-cluster';
d3.forceAttract = forceAttract;
d3.forceCluster = forceCluster;

import {click, labelsArray} from './click';
import {zoom} from './zoom';
import { textFormatter } from './utilities';
import { imageSize, imagePosition, fontSize, textAnchor, textAlignment, textPosition, strokeColor, imagesURL, rectPosition, rectFill, rectSize, rectFilter, textWidth, textMaxLen, typePixelSize } from './constants';
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
const zoomWidth = -(GRID_WIDTH * GRID_UNIT_SIZE/2);
const zoomHeight = -(GRID_HEIGHT * GRID_UNIT_SIZE/2);
console.log('zoomWidth', zoomWidth)


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
  
  node.classed("latest", false);

  node.exit()
    .remove();

  // Enter any new nodes.
  var nodeEnter = node.enter().append("g")
    .attr("class", d => d.type + " node latest")
    .attr("name", function (d) { return d.name; })

  nodeEnter.append("rect")
    .attr("class", "bg-rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", d => typePixelSize[d.type][0])
    .attr("height", d => typePixelSize[d.type][1])

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
    .attr("x", d => imagePosition[d.type][0])
    .attr("y", d => imagePosition[d.type][1])
    // .transition(t)
    .attr("height", d => imageSize[d.type] ) 
    .attr("width", d => imageSize[d.type])
    .attr("alignment-baseline", "middle")

  //   new d3plus.TextBox()
  // .data(nodes)
  // .fontResize(true)
  // .height(100)
  // .width(200)
  // .x(function(d, i) { return i * 250; })
  // .render();
  // Append title 
  var nodeEnterText = nodeEnter.append("text")
    .attr("text-anchor", d => textAnchor[d.type])
    .attr("alignment-baseline", d => textAlignment[d.type])
    .attr("x", d => textPosition[d.type][0])
    .attr("y", d => textPosition[d.type][1])
    .attr("font-size", d => fontSize[d.type])
    .attr("fill", "#464646");

  nodeEnterText.append("tspan")
    .attr("class", "name name-line1")
    .text(d =>  textFormatter(d.name, textWidth[d.type], textMaxLen[d.type])[0])
    
  nodeEnterText.append("tspan")
    .attr("class", "name name-line2")
    .text(d =>  textFormatter(d.name, textWidth[d.type], textMaxLen[d.type])[1])
    .attr("x", d => textPosition[d.type][0])
    .attr("dy", d => fontSize[d.type]*1.1)
  
  // Append price for products 
  nodeEnterText.filter(d => d.type === "product")
    .append("tspan")
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


