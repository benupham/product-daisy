/* 

Types of promo items:

-- A single product with a "Sale" or "Vegan" or whatever corner fold
-- A CTA button than opens a group of products
-- A display area with title, open group of products, description below

Steps:

1. Create the promo items from source data
2. Create their styles

Behavior
-- Positioned on the grid after all product groups have been positioned
-- Removed every time a product group is clicked and repositioned after
-- If a promo item is clicked, all other promo items are repositioned 

*/
import { grid } from './groupToGrid';
const promoCount = 20;

export function addPromoItems(items, promoItems, bounds) {

  // for (let i = 0; i < promoCount; i++) {
  //   let c = Math.floor(Math.random() * Math.floor(promoItems.length));

  //   const promoItem = promoItems[c];
  //   promoItem.x = (bounds[0][0] + bounds[1][0]) / 2;
  //   promoItem.y = (bounds[0][1] + bounds[1][1]) / 2;
  //   grid.snapToGrid(promoItem);
  //   items.push(promoItem);
    
  // }
}

export function removePromoItems(items, grid) {
  
  for( var i = 0; i < items.length; i++){ 
    if ( items[i].promo === true) {
      grid.resetCells(items[i].cells);
      items.splice(i, 1);
      i--;
    }
  }
  
}


// translate page to SVG coordinate
function svgPoint(element, x, y) {

  const pt = svg.createSVGPoint();
  pt.x = x;
  pt.y = y;

  return pt.matrixTransform( element.getScreenCTM().inverse() );

}
