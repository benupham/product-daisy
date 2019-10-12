import * as d3 from 'd3';

import {depts,subdepts,brands,products, nodes, update, svg} from './index';

export const labelsArray = [];

export function click(d) {
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

  console.log('clicked node',d)

  // Remove the clicked parent node
  for( var i = 0; i < nodes.length; i++){ 
    if ( nodes[i].id === d.id) {
      nodes.splice(i, 1);
    }
  }

  newNodes.forEach((n,i) => {
      n.x = d.x;
      n.y = d.y;
      nodes.unshift(n);   
       
  });
  update(); 
  nodes.forEach(n => console.log(n.name, n.x, n.y));
}


