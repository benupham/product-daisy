import * as d3 from 'd3';

import {depts,subdepts,brands,products, items, update, svg, zoomable, zoom, itemsByGroup} from './index';
import {grid} from './groupToGrid';
import { zoomIdentity } from 'd3';

export const labelsArray = [];

export function click(d) {
  d3.event.stopPropagation();
  const clickPoint = d3.mouse(zoomable.node());
  let clickTracker = document.getElementById("clickTracker");
  clickTracker.innerHTML = "clicked: " + clickPoint[0] + ", " + clickPoint[1];

  if (d.open === true) {
   
    removeDescendants(d);

  } else {

    let newItems = []; 
    if (d.type == 'dept') {
      newItems = subdepts.filter(sd => sd.parent == d.id)
    } else if (d.type == 'subdept') {
      newItems = brands.filter(b => b.parent == d.id)
    } else if (d.type == 'brand') {
      newItems = products.filter(p => p.parent == d.id)
    } else {
      return
    }
  
    d.children = newItems;
    labelsArray.push(d);
    d.open = true;
  
    console.log('new items: ',newItems);
  
    
    // Start the new nodes at click location
    newItems.forEach((n,i) => {
        n.x = clickPoint[0];
        n.y = clickPoint[1];  
         
    });
    
    itemsByGroup.unshift(newItems);

    // Position the newest group of items on the grid
    grid.snapToGrid(itemsByGroup[0]);

    // Add them to the nodes for styling
    items.push(...itemsByGroup[0]); 
    
    const [[x0, y0], [x1, y1]] = grid.itemsGridBounds;
    
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
  
  update(); 

  
  
}

function removeDescendants(d) {
  
  // Remove the children of clicked parent item
  for( var i = 0; i < items.length; i++){ 
    if ( items[i].parent === d.id) {
      console.log('removed ',items[i].name);
      grid.resetCells(items[i].cells);
      if (items[i].open) {
        console.log('second level',items[i].name);
        removeDescendants(items[i]);
      }
      items.splice(i, 1);
      i--;
    }
  }
  d.open = false;

}
