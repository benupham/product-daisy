import * as d3plus from 'd3plus-text';
import { nameFontSize, nameWidth } from './constants';

const textwrap = d3plus.textWrap();                      

export function wrapNames(items) {
  items.forEach(d => {
    const name = d.name;
    
    textwrap.fontSize(nameFontSize[d.type]).width(nameWidth[d.type]);
    
    d.nameWrap = textwrap(name);
    console.log(d.nameWrap)
  })  
}
