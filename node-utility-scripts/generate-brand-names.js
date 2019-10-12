const fs = require('fs')

const productsMaster = JSON.parse(fs.readFileSync('./data/productSet.json','utf8'));

productsMaster.forEach(f => {
  if (f.type === 'brand') {
    f.name = generateBrand(f);
  }
});

function generateBrand(brand) {
  const brandProducts = [];
  productsMaster.forEach(f => {
    if (f.parent === brand.id) {
      brandProducts.push(f.name);
    }
  }) 
  if (brandProducts.length > 1) {
    const brandName = sharedStart(brandProducts);
    if (brandName.length > brand.name.length) {
      return brandName
    } else {
      return brand.name;
    }      
  } else {
    return brand.name; 
  }
}

function sharedStart(array){
  var A= array.concat().sort(), 
  a1= A[0], a2= A[A.length-1], L= a1.length, i= 0;
  while(i<L && a1.charAt(i)=== a2.charAt(i)) i++;
  return a1.substring(0, i);
}

fs.writeFile('./data/test-brand-generation.json', JSON.stringify(productsMaster, null, 2), (err) => {if (err) console.log(err); });

