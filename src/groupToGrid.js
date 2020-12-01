import { items } from ".";
import { GRID_WIDTH, GRID_HEIGHT, GRID_UNIT_SIZE, typeSize } from "./constants";

/* 

Based on snapToGrid.js, but where each item level group first arranges in square of optimal width/height
ratio, then positions itself as close as possible to its parent originator. The position of the parent 
and its group does not change. 

Steps:
1. Count # of objects in a group (dept, subdept, brand, products)
2. Calculate optimal square width/height based on object grid size (ie 1x2, 2x1 etc)
3. Run fitByType based on total grid size of that square
4. Update the position of all objects in the group based on final location of 0,0 square
5. Objects are positioned by their order in the array. This does not change. 

*/

export let grid = {
  cells : [],
  
  init : function() {
    this.cells = [];
    for(var i = 0; i < GRID_WIDTH; i++) {
      for(var j = 0; j < GRID_HEIGHT; j++) {
        var cell;
        cell = {
          x : i * GRID_UNIT_SIZE,
          y : j * GRID_UNIT_SIZE,
          occupied : false,
          pid: null,
          parent: null
        };
        this.cells.push(cell);
      };
    };
  },
  
  resetCells : function(occupiedCells) {
    occupiedCells.forEach(cellId =>{
      this.cells[cellId].occupied = false;
      this.cells[cellId].pid = null;
      this.cells[cellId].parent = null;  
    })
  },

  sqdist : function(a, b) {    
    // return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
    return Math.hypot(a.x - b.x, a.y - b.y);
  },

  // Finds the closest of any of the points in the sub-grid 
  sqdist2 : function(parent, candidate) {

    let a = parent;

    return candidate.reduce((prev,current) => {
      let c = this.cells[current];
      return this.sqdist(a, c) < prev ? this.sqdist(a, c) : prev
    }, 99999999)


  },

  fitByType : function(i) {
    //Instead of using the item (p) width/height, that is 
    // set with the itemsWidth/Height properties
    let candidate = [];
    let theWidth = this.itemsWidth;
    let theHeight = this.itemsHeight; 
    
    // Check that all points in a item type size are available 
    // TODO: change to use reduce()
    loop1 : // named loops can be broken by nested loop break commands
    for (let width = 0; width < theWidth; width++) {
      let xpoint = i + (width * GRID_HEIGHT); 
      if (this.cells[xpoint] && !this.cells[xpoint].occupied) {
        candidate.push(xpoint);
        for (let height = 1; height < theHeight; height++) {
          let ypoint = xpoint + height;
          if (this.cells[ypoint] && !this.cells[ypoint].occupied) {
            candidate.push(ypoint)
          } else {
            candidate = false;
            break loop1;
          }
        }
      } else {
        candidate = false; 
        break loop1;
      } 
    }
    
    return candidate
  },

  itemsWidth : 0,
  itemsHeight : 0,
  itemsGridBounds : [],
  itemsType : null,
  itemsSize : [],

  snapToGrid : function(p) { 

    if (Array.isArray(p)) {

      // Create a rectangle/square big enough to fit all the items 
      // in array of items p...
      let typeWidth = typeSize[p[0].type][0];
      let typeHeight = typeSize[p[0].type][1];
      let totalUnits = p.length * typeWidth * typeHeight;
      let sqrt = Math.floor(Math.sqrt(p.length));

      if (typeWidth >= typeHeight) {
        console.log('width >= height')
        let itemsWidthUnits = sqrt * typeWidth;
        console.log('items',p.length,'totalunits', totalUnits, 'sqrt', sqrt, 'width in units',itemsWidthUnits);
        for (let i = 0; i < totalUnits; i++) {
          if (itemsWidthUnits * i * typeHeight >= totalUnits) {
            this.itemsHeight = i * typeHeight;
            this.itemsWidth = itemsWidthUnits;
            console.log(this.itemsWidth)
            break;
          } 
        }
      } else {
        console.log('height > width')
        
        // Push product groups to be wider than tall.
        let itemsHeightUnits = Math.max(sqrt-1,1) * typeHeight;
        console.log('items',p.length,'totalunits', totalUnits, 'sqrt', sqrt, 'height in units',itemsHeightUnits);
        for (let i = 0; i < totalUnits; i++) {
          if (itemsHeightUnits * i * typeWidth >= totalUnits) {
            this.itemsWidth = i * typeWidth;
            this.itemsHeight = itemsHeightUnits;
            console.log(this.itemsWidth)
            break;
          } 
        }
      }

      console.log('width and height',this.itemsWidth, this.itemsHeight)
      
    } else {
      // I don't think this is ever called...? 
      console.log('p is not an array')
    }

    // Then find the closest spot for that rectangle. 
    let itemsGrid = this.occupyNearest(p);
    console.log('item grid',itemsGrid);

    this.itemsType = p[0].type; 
    this.itemsSize = typeSize[this.itemsType];
    console.log("items size",this.itemsSize)
   
    if (itemsGrid) {  
      
      this.itemsGridBounds = 
        [[this.cells[itemsGrid[0]].x, 
        this.cells[itemsGrid[0]].y],
        // these corners of the bounds take account
        // of the fact that items are irregular sizes
        [this.cells[itemsGrid[itemsGrid.length-1]].x + this.itemsSize[0] * GRID_UNIT_SIZE, 
        this.cells[itemsGrid[itemsGrid.length-1]].y + this.itemsSize[1] * GRID_UNIT_SIZE]];   
      console.log('grid bounds:',this.itemsGridBounds)  

      if (Array.isArray(p)) {

        // Now basically need to repeat the fitting process with
        // the space inside the itemsgrid for all the items in p 
        p.forEach( pr => {
          
          let type = pr.type;
          this.itemsWidth = typeSize[type][0];
          this.itemsHeight = typeSize[type][1]; 

          for (let i = 0; i < itemsGrid.length; i++) {
            const cell = itemsGrid[i];
            const candidate = this.fitByType(cell);
            if (candidate) {
              // the cells occupied by the item
              pr.cells = [];

              candidate.forEach( e => {
                this.cells[e].occupied = true;
                this.cells[e].pid = p[0].id;
                this.cells[e].parent = p[0].parent;
                pr.cells.push(e);
              });
              // console.log('cell', cell)
              pr.ix = pr.x;
              pr.iy = pr.y;
              pr.x = this.cells[cell].x;
              pr.y = this.cells[cell].y;
              pr.groupBounds = this.itemsGridBounds;
              break;
            }
            
          }

        })
      }    
    }
  },

  occupyNearest : function(p) {
    var minDist = 100000000;
    var d;
    let winner = [];

    /* TODO: Rewrite as a search rippling out as
    concentric circles from the clicked item, return
    first match, rather than search through every grid coordinate.     
    */
    for(var i = 0; i < this.cells.length; i++) {
      let candidate = this.fitByType(i);
      
      if (candidate && (d = this.sqdist2(p[0], candidate)) < minDist ) { 
        minDist = d;
        winner = candidate;
      }
    }
    if (winner.length > 0) {

      return winner
      
    } else {
      console.log('I guess the grid is full');
      return false
    }

  }
}
