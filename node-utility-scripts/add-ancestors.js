const fs = require('fs')

const productsMaster = JSON.parse(fs.readFileSync('./data/working-feature-set.json','utf8'));
const productSet = JSON.parse(fs.readFileSync('./data/productSet.json','utf8'));

productSet.forEach(d => {
  const f = productsMaster.features.filter(f => f.id === d.id)[0];
  d.brand = f.properties.brand;
  d.subdept = f.properties.subdept;
  d.dept = f.properties.dept;

});


fs.writeFile('./data/test-add-ancestors.json', JSON.stringify(productSet, null, 2), (err) => {if (err) console.log(err); });