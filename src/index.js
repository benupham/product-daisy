import * as d3 from 'd3';
import * as d3plus from 'd3plus-text';
import { forceAttract } from 'd3-force-attract';
import {forceCluster} from 'd3-force-cluster';
d3.forceAttract = forceAttract;
d3.forceCluster = forceCluster;

import {click, labelsArray} from './click';
import {createControls, handleHover} from './hover';
import {zoom, transform, zoomToBounds} from './zoom';
import { textFormatter } from './utilities';
import { imageSize, imagePosition, nameFontSize, nameAnchor, nameAlignment, namePosition, strokeColor, imagesURL, rectPosition, rectFill, rectSize, rectFilter, nameWidth, nameMaxLen, typePixelSize } from './constants';
import { grid } from './groupToGrid';
import { GRID_WIDTH, GRID_UNIT_SIZE, GRID_HEIGHT } from './constants';
import { wrapNames } from './sizeText';
import { onMouseOver} from './devTools';
import { addPromoItems } from './promoItems';

import './styles/style.css';
import { addBuyButton, addImages, addName, addProductStars, styleRectWrap } from './svgStyles';

export const depts = [];
export const subdepts = [];
export const brands = [];
export const products = [];
export const promoItems = [];

export let items = [];
export let itemsByGroup = [];

// The container for all the action.
// Zoom is called on this, but zoomable does the zooming
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

      // Add all the promo subdepts here
      if (d.name.includes("Sales")) { 
        let promo = Object.assign({}, d);
        promo.promo = true;
        promo.id = promo.id + '-promo';
        promo.parent = promo.parent + '-promo';
        promoItems.push(promo);
      }

    } else if (d.type === 'brand') {
      brands.push(d);

      // Add the promo brand items 
      if (d.img.includes("sales")) { 
        let promo = Object.assign({}, d);
        promo.promo = true;
        promo.id = promo.id + '-promo';
        promo.parent = promo.parent + '-promo';
        promoItems.push(promo);
      }
    } else if (d.type === 'product') {
      products.push(d);

      // Add promo products
      if (d.price.includes("Reg:")) { 
        let promo = Object.assign({}, d);
        promo.promo = true;
        promo.id = promo.id + '-promo';
        promo.parent = promo.parent + '-promo';
        promoItems.push(promo);
      }
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
  zoomToBounds(grid.groupGridBounds);
  
  addPromoItems(items, promoItems, grid.groupGridBounds);  

  createControls(zoomable);

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
  // Add the title
  addName(nodeEnter);
  // For products, add star rating
  addProductStars(nodeEnter);
  // For products, add buy button 
  addBuyButton(nodeEnter);
  
  node = nodeEnter
    .merge(node)
  
  node
    .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ") scale(1)"; })

  
  // slowly fades the glow on the most recently added items  
  document.getElementById("fade-to-grey").beginElement();
  document.getElementById("shrink").beginElement();

  node.on("click", click);
  node.on("mouseover", handleHover);

  
}  


