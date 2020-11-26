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
    return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
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
    // set with the itemWidth/Height properties
    let candidate = [];
    let theWidth = this.itemWidth;
    let theHeight = this.itemHeight; 
    
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

  itemWidth : 0,
  itemHeight : 0,

  snapToGrid : function(p) { 

    if (Array.isArray(p)) {

      // Create a rectangle/square big enough to fit all the items 
      // in p...
      // This needs to be rewritten to account for landscape vs. portrait
      // orientation of products vs brands, subdept
      let sqrt = Math.sqrt(p.length);
      console.log('sqrt',sqrt)
      let type = p[0].type;
      this.itemWidth = typeSize[type][0] * Math.round(sqrt);
      if (p.length % sqrt == 0) {
        this.itemHeight = typeSize[type][1] * Math.floor(sqrt);
      } else {
        this.itemHeight = typeSize[type][1] * Math.ceil(sqrt);
      }
      
      console.log('width and height',this.itemWidth, this.itemHeight)
      
    } else {
      // I don't think this is ever called...? 
      console.log('p is not an array')
      let type = p.type;
      this.itemWidth = typeSize[type][0];
      this.itemHeight = typeSize[type][1];  
    
    }

    // Then find the closest spot for that rectangle. 
    let itemGrid = this.occupyNearest(p);
    console.log(itemGrid);
   
    if (itemGrid) {  
      // top left corner of this item grid, whether single
      // product or group
      // Don't think this is needed
      let origin = itemGrid[0];   

      if (Array.isArray(p)) {
        // console.log('itemGrid', itemGrid)

        // Now basically need to repeat the fitting process with
        // the space inside the p grid 
        p.forEach( pr => {
          // console.log('pr',pr)
          let type = pr.type;
          this.itemWidth = typeSize[type][0];
          this.itemHeight = typeSize[type][1]; 

          for (let i = 0; i < itemGrid.length; i++) {
            const cell = itemGrid[i];
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
              break;
            }
            
          }

        })
      } else {
        // I don't think this is ever called
        // as only products would not be an array
        // and they don't call update() on click
        //console.log('not an array of p')
        itemGrid.forEach(e => {
          this.cells[e].occupied = true;
          this.cells[e].pid = p.id;
          this.cells[e].parent = p.parent;
        }); 
              
        p.x = this.cells[origin].x;
        p.y = this.cells[origin].y;
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
