export const imagesURL = window.location.href === "http://localhost:3000/" ? "./images/" : "https://s3-us-west-1.amazonaws.com/consumerland/";

export const GRID_WIDTH = 150;
export const GRID_HEIGHT = 150;

export const GRID_UNIT_SIZE = 200; 
const UNIT_MARGIN = 25;

export const strokeColor = {
  "product" : "white",
  "brand" : "#e5e5e5",
  "subdept" : "#e5e5e5",
  "dept" : "#e5e5e5"
}

export const rectPosition = {
  "product" : [UNIT_MARGIN/2,UNIT_MARGIN/2],
  "brand" : [UNIT_MARGIN/2,UNIT_MARGIN/2],
  "subdept" : [0,0],
  "dept" : [0,0]
}

export const rectSize = {
  "product" : [GRID_UNIT_SIZE - UNIT_MARGIN, 2*GRID_UNIT_SIZE - UNIT_MARGIN],
  "brand" : [2*GRID_UNIT_SIZE - UNIT_MARGIN,GRID_UNIT_SIZE - UNIT_MARGIN],
  "subdept" : [2*GRID_UNIT_SIZE - UNIT_MARGIN,2*GRID_UNIT_SIZE - UNIT_MARGIN],
  "dept" : [3*GRID_UNIT_SIZE - UNIT_MARGIN,3*GRID_UNIT_SIZE - UNIT_MARGIN]
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
  "dept" : 3*GRID_UNIT_SIZE - UNIT_MARGIN
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
  "dept" : "start"
}

export const textPosition = {
  "product" : [15,GRID_UNIT_SIZE + 22],
  "brand" : [50,112],
  "subdept" : [GRID_UNIT_SIZE,GRID_UNIT_SIZE],
  "dept" : [GRID_UNIT_SIZE,GRID_UNIT_SIZE]
}


export const fontSize = {
  "product" : 18,
  "brand" : 24,
  "subdept" : 26,
  "dept" : 36
}

export const paddings = {
  "sameParent" : 100,
  "sameGrandParent" : 200,
  "sameGGrandParent" : 300,
  "noRelation" : 400
}