import * as d3 from 'd3';

import {depts,subdepts,brands,products, items, update, svg, zoomable, zoom, itemsByGroup} from './index';
import {grid} from './groupToGrid';
import { zoomIdentity } from 'd3';
import { clickTracker } from './devTools';
import { zoomToBounds } from './zoom';

export const labelsArray = [];

export function click(d) {

  d3.event.stopPropagation();
  let clickPoint = d3.mouse(zoomable.node());
  clickTracker(clickPoint);

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
   
    zoomToBounds(grid.itemsGridBounds);
  }

  update(); 

}

function removeDescendants(parent) {
  
  // Remove the children of clicked parent item
  for( var i = 0; i < items.length; i++){ 
    if ( items[i].parent === parent.id) {
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
  parent.open = false;
  
  zoomToBounds(parent.groupBounds);

}

