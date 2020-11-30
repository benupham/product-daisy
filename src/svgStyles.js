import { imageSize, imagePosition, nameFontSize, nameAnchor, nameAlignment, namePosition, strokeColor, imagesURL, rectPosition, rectFill, rectSize, rectFilter, nameWidth, nameMaxLen, typePixelSize } from './constants';

export function styleRectWrap(node) {

  return node.append("rect")
    .attr("name", function (d) { return d.name; })
    .attr("class", "wrap")
    .attr("x", d => rectPosition[d.type][0])
    .attr("y", d=> rectPosition[d.type][1])
    .attr("fill", d => rectFill[d.type])
    .attr("fill-opacity", 1)
    .attr("stroke", d => strokeColor[d.type])
    .attr("height", d => rectSize[d.type][1]) 
    .attr("width", d => rectSize[d.type][0])

}

export function addImages(node) {

  return node.append("image")
    .attr("xlink:href", function (d) { return imagesURL + (d.img || "product-images/missing-item.jpg"); })
    .attr("name", function (d) { return d.name; })
    .attr("class", "item-image")
    .attr("x", d => imagePosition[d.type][0])
    .attr("y", d => imagePosition[d.type][1])
    .attr("height", d => imageSize[d.type] ) 
    .attr("width", d => imageSize[d.type])
    .attr("alignment-baseline", "middle")

}

export function addName(node) {

   // Append name 
   let nodeEnterText = node.append("text")
   .attr("class", "name name-line1")
   .attr("text-anchor", d => nameAnchor[d.type])
   .attr("alignment-baseline", d => d.nameWrap.lines.length > 1 ? "start" : "middle")
   .attr("x", d => namePosition[d.type][0])
   .attr("y", d => d.nameWrap.lines.length > 1 ? namePosition[d.type][1] - nameFontSize[d.type]/5 : namePosition[d.type][1])
   .attr("font-size", d => nameFontSize[d.type])
   .attr("fill", "#464646")
   .text(d =>  d.nameWrap.lines[0]);
   
  nodeEnterText.filter(d => d.nameWrap.lines[1])
    .append("tspan")
    .attr("class", "name name-line2")
    .attr("x", d => namePosition[d.type][0])
    .attr("y", d => namePosition[d.type][1] + nameFontSize[d.type])
    .text(d =>  d.nameWrap.lines[1]);
  
  // Append price for products 
  nodeEnterText.filter(d => d.type === "product")
    .append("tspan")
    .text(d =>  d.price)  
    .attr("class", "price")
    .attr("font-size", nameFontSize["product"])
    .attr("fill", "#B12704")
    .attr("x", d => namePosition[d.type][0])
    .attr("dy", d => nameFontSize[d.type]*3);

}