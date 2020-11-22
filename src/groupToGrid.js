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
    
  sqdist : function(a, b) {
    if (Array.isArray(a)) {a = a[0];};
    return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
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
            candidate = [];
            break loop1;
          }
        }
      } else {
        candidate = []; 
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
      let type = p[0].type;
      this.itemWidth = typeSize[type][0] * Math.ceil(Math.sqrt(p.length));
      this.itemHeight = typeSize[type][1] * Math.ceil(Math.sqrt(p.length));
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
            if (candidate.length > 0) {
              // console.log(pr.name, candidate)
              candidate.forEach( e => {
                this.cells[e].occupied = true;
                this.cells[e].pi = p.id;
                this.cells[e].parent = p.parent;
              });
              // console.log('cell', cell)
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

    /* TODO: Rewrite as a search spiraling out from 
    the location of the clicked parent item
    instead of starting at the first cell in the grid
    I guess this could be done by first finding the closest
    cell to the cell of the parent and checking that.
    The problem is also that the upper left corner of the 
    sub-grid may not be the closest part of the sub-grid to the
    parent.     
    */
    for(var i = 0; i < this.cells.length; i++) {
      let candidate = this.fitByType(i);
      
      if ((d = this.sqdist(p, this.cells[i])) < minDist && candidate.length > 0) { 
        minDist = d;
        winner = candidate;
      }
    }
    if(winner.length > 0) {

      return winner
      
    }
    // it's the first item on the grid
    //return [0,0]
  }
}
