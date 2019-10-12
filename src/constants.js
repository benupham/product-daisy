export const imagesURL = window.location.href === "http://localhost:3000/" ? "./images/" : "https://s3-us-west-1.amazonaws.com/consumerland/";

export const GRID_WIDTH = 150;
export const GRID_HEIGHT = 150;

export const GRID_UNIT_SIZE = 200; 
const UNIT_MARGIN = 25;

export const typeSize = {
  "product" : [1,2],
  "brand" : [2,1],
  "subdept" : [4,2],
  "dept" : [4,3]
}

export const strokeColor = {
  "product" : "white",
  "brand" : "#464646",
  "subdept" : "#464646",
  "dept" : "#464646"
}

export const rectPosition = {
  "product" : [UNIT_MARGIN/2,UNIT_MARGIN/2],
  "brand" : [UNIT_MARGIN/2,UNIT_MARGIN/2],
  "subdept" : [UNIT_MARGIN/2,UNIT_MARGIN/2],
  "dept" : [UNIT_MARGIN/2,UNIT_MARGIN/2]
}

export const rectSize = {
  "product" : [typeSize["product"][0]*GRID_UNIT_SIZE - UNIT_MARGIN, typeSize["product"][1]*GRID_UNIT_SIZE - UNIT_MARGIN],
  "brand" : [typeSize["brand"][0]*GRID_UNIT_SIZE - UNIT_MARGIN, typeSize["brand"][1]*GRID_UNIT_SIZE - UNIT_MARGIN],
  "subdept" : [typeSize["subdept"][0]*GRID_UNIT_SIZE - UNIT_MARGIN, typeSize["subdept"][1]*GRID_UNIT_SIZE - UNIT_MARGIN],
  "dept" : [typeSize["dept"][0]*GRID_UNIT_SIZE - UNIT_MARGIN, typeSize["dept"][1]*GRID_UNIT_SIZE - UNIT_MARGIN]
}

export const rectFill = {
  "product" : "#fff",
  "brand" : "#fff",
  "subdept" : "#fff",
  "dept" : "#fff"
}

export const rectFilter = {
  "product" : "url(#dropshadow)",
  "brand" : "url(#dropshadow)",
  "subdept" : "url(#dropshadow)",
  "dept" : "url(#dropshadow)"
}

export const imageSize = {
  "product" : GRID_UNIT_SIZE - UNIT_MARGIN,
  "brand" : GRID_UNIT_SIZE - UNIT_MARGIN,
  "subdept" : 2*GRID_UNIT_SIZE - UNIT_MARGIN,
  "dept" : 2*GRID_UNIT_SIZE - UNIT_MARGIN
}

export const imagePosition = {
  "product" : [12.5,12.5],
  "brand" : [GRID_UNIT_SIZE + 25,25],
  "subdept" : [0,0],
  "dept" : [0,0]
}



export const textAnchor = {
  "product" : "start",
  "brand" : "start",
  "subdept" : "start",
  "dept" : "middle"
}

export const textPosition = {
  "product" : [15,GRID_UNIT_SIZE + 22],
  "brand" : [50,112],
  "subdept" : [GRID_UNIT_SIZE,GRID_UNIT_SIZE],
  "dept" : [6*GRID_UNIT_SIZE/2 + UNIT_MARGIN/2,GRID_UNIT_SIZE + UNIT_MARGIN/2]
}

export const fontSize = {
  "product" : 18,
  "brand" : 24,
  "subdept" : 26,
  "dept" : 72
}
