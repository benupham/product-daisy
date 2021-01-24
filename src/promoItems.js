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

const { items, promoItems } = require("./index");

export function addPromoItems() {
  items.push(promoItems[0]);
}