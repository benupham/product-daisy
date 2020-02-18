import { GRID_WIDTH, GRID_HEIGHT, GRID_UNIT_SIZE, typeSize } from "./constants";

/* 

1. All nodes are assigned a pre-existing grid location
2. When new nodes enter, they are assigned the closest grid location that does not have a node
from the entering group.
3. When a node is displaced by an entering node, it is added to the end of the entering node group
to be repositioned 
4. This means all nodes are repositioned (rippled) with each action. 

Based on this: https://observablehq.com/@kikinna/uaah-force-directed-layout-in-a-grid

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
    //console.log('cells', this.cells);
  },
    
  sqdist : function(a, b) {
    return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
  },

  checkNeighbor : function(p, i) {
    if (this.cells[i + GRID_HEIGHT].parent === p.parent) {
      return true
    } else if (this.cells[i - GRID_HEIGHT].parent === p.parent) {
      return true
    } else if (this.cells[i + 1].parent === p.parent) {
      return true
    } else if (this.cells[i - 1].parent === p.parent) {
      return true
    } 

    if (!this.cells.some(c => c.parent === p.parent)) {
      return true
    } else {
      return false
    }
  },

  fitByType : function(p, i) {
    let type = p.type;
    let candidate = [];

    // Check that all points in a item type size are available 
    // TODO: change to use reduce()
    loop1 : // named loops can be broken by nested loop break commands
    for (let width = 0; width < typeSize[type][0]; width++) {
      let point = i + (width * GRID_HEIGHT); 
      if (this.cells[point] && !this.cells[point].occupied) {
        candidate.push(i + (width * GRID_HEIGHT));
        for (let height = 0; height < typeSize[type][1]; height++) {
          point = i + height + (width * GRID_HEIGHT);
          if (this.cells[point] && !this.cells[point].occupied) {
            candidate.push(i + height + (width * GRID_HEIGHT))
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

  snapToGrid : function(p) { 
    let gridpoint = grid.occupyNearest(p);
    if (gridpoint) {            
        p.x = gridpoint.x;
        p.y = gridpoint.y;
      }
  },

  occupyNearest : function(p) {
    var minDist = 100000000;
    var d;
    let candidate = false;

    for(var i = 0; i < this.cells.length; i++) {
      
      if((d = this.sqdist(p, this.cells[i])) < minDist) {
        if (Array.isArray(this.fitByType(p, i))) {
          minDist = d;
          candidate = this.fitByType(p, i);
          //console.log('before',candidate)  
        }
      }
    }
    if(candidate != false && candidate.length > 0) {
      candidate.forEach(e => {
        this.cells[e].occupied = true;
        this.cells[e].pid = p.id;
        this.cells[e].parent = p.parent;
      });
      return this.cells[candidate[0]];
    }
    // const testCells = this.cells.filter(c => c.occupied == true);
    //         console.log('occupied cells',testCells); 
    return [0,0]
  }
}

//grid.init();