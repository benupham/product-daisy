import * as d3 from 'd3';

import {depts,subdepts,brands,products, items, update, svg, itemsByGroup} from './index';
import {grid} from './groupToGrid';

export const labelsArray = [];

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

export function click(d) {
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
  
    const clickPoint = d3.mouse(this);
    // Start the new nodes at click location
    newItems.forEach((n,i) => {
        n.x = d.x + clickPoint[0];
        n.y = d.y + clickPoint[1];  
         
    });
    

    
    itemsByGroup.unshift(newItems);
    // console.log('newItems', newItems)
    // console.log('itemsByGroup',itemsByGroup)
    // Position the newest group of items on the grid
    grid.snapToGrid(itemsByGroup[0]);

    // Add them to the nodes for styling
    items.push(...itemsByGroup[0]);
  
    
  }

  update(); 
  
  // items.forEach(n => console.log(n.name, n.x, n.y));
}


