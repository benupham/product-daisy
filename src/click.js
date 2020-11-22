import * as d3 from 'd3';

import {depts,subdepts,brands,products, items, update, svg, itemsByGroup} from './index';

export const labelsArray = [];

export function click(d) {

  if (d.open === true) {
    return
  }

  let newNodes = []; 
  if (d.type == 'dept') {
    newNodes = subdepts.filter(sd => sd.parent == d.id)
  } else if (d.type == 'subdept') {
    newNodes = brands.filter(b => b.parent == d.id)
  } else if (d.type == 'brand') {
    newNodes = products.filter(p => p.parent == d.id)
  } else {
    return
  }

  d.children = newNodes;
  labelsArray.push(d);
  d.open = true;

  console.log('new items: ',newNodes);

  // Remove the clicked parent item
  // for( var i = 0; i < items.length; i++){ 
  //   if ( items[i].id === d.id) {
  //     items.splice(i, 1);
  //   }
  // }

  // Start the new nodes at the location of parent
  newNodes.forEach((n,i) => {
      n.x = d.x;
      n.y = d.y;
      // items.unshift(n);   
       
  });

  itemsByGroup.unshift(newNodes);
  // console.log('newnodes', newNodes)
  // console.log('itemsByGroup',itemsByGroup)

  update(); 
  // items.forEach(n => console.log(n.name, n.x, n.y));
}


