import { GRID_WIDTH, GRID_HEIGHT, GRID_UNIT_SIZE } from "./constants";

/* 

1. All nodes are assigned a pre-existing grid location
2. When new nodes enter, they are assigned the closest grid location that does not have a node
from the entering group.
3. When a node is displaced by an entering node, it is added to the end of the entering node group
to be repositioned 
4. This means all nodes are repositioned (rippled) with each action. 

Use this: https://observablehq.com/@kikinna/uaah-force-directed-layout-in-a-grid

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
          occupied : false
        };
        this.cells.push(cell);
      };
    };
    //console.log('cells', this.cells);
  },
    
  sqdist : function(a, b) {
    return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
  },

  fitToType : function(d, i) {
    let type = d.type;

    switch (type) {
      case 'dept':  
         
        if (this.cells[i+1] && this.cells[i+2] && 
            this.cells[i+GRID_HEIGHT] && this.cells[i+GRID_HEIGHT+1] && this.cells[i+GRID_HEIGHT+2] && 
            this.cells[i+(2*GRID_HEIGHT)] && this.cells[i+(2*GRID_HEIGHT)+1] && this.cells[i+(2*GRID_HEIGHT)+2]
           ) {
            
            if (!this.cells[i].occupied && !this.cells[i+1].occupied && !this.cells[i+2].occupied &&
                !this.cells[i+GRID_HEIGHT].occupied && !this.cells[i+GRID_HEIGHT+1].occupied && !this.cells[i+GRID_HEIGHT+2].occupied && 
                !this.cells[i+(2*GRID_HEIGHT)].occupied && !this.cells[i+(2*GRID_HEIGHT)+1].occupied && !this.cells[i+(2*GRID_HEIGHT)+2].occupied
                ) {
                  
              return [
                      i, i+1, i+2, 
                      i+GRID_HEIGHT, i+GRID_HEIGHT+1, i+GRID_HEIGHT+2, 
                      i+(2*GRID_HEIGHT), i+(2*GRID_HEIGHT)+1, i+(2*GRID_HEIGHT)+2
                    ]
            }
        } 
        break;
        
      case 'subdept':
   
        if (this.cells[i+1] && 
          this.cells[i+GRID_HEIGHT] && this.cells[i+GRID_HEIGHT+1]           
          ) {
          
            if (!this.cells[i].occupied && !this.cells[i+1].occupied &&
                !this.cells[i+GRID_HEIGHT].occupied && !this.cells[i+GRID_HEIGHT+1].occupied 
                ) {
                  
              return [
                      i, i+1, 
                      i+GRID_HEIGHT, i+GRID_HEIGHT+1
                    ]
          }
        } 
        break;    

      case 'brand':
        if (this.cells[i+GRID_HEIGHT] && !this.cells[i].occupied && !this.cells[i+GRID_HEIGHT].occupied) {
          return [i, i+GRID_HEIGHT]
        } 
        break;
  
      case 'product':
        if (this.cells[i+1] && !this.cells[i].occupied && !this.cells[i+1].occupied) {
          return [i, i+1]
        } 
        break;
      
      default:
        return false
    }
  },

  snapToGrid : function(d) { 
    let gridpoint = grid.occupyNearest(d);
    if (gridpoint) {            
        // ensures smooth movement towards final positoin
        // d.x += (gridpoint.x - d.x) * .33;
        // d.y += (gridpoint.y - d.y) * .33;
      
        // jumps directly into final position  
        d.x = gridpoint.x;
        d.y = gridpoint.y
      }
  },

  occupyNearest : function(p) {
    var minDist = 100000000;
    var d;
    var candidate = false;

    for(var i = 0; i < this.cells.length; i++) {
      
      if((d = this.sqdist(p, this.cells[i])) < minDist && Array.isArray(this.fitToType(p, i))) {
        minDist = d;
        candidate = this.fitToType(p, i);
        //console.log('before',candidate)
      }
    }
    if(candidate != false && candidate.length > 0) {
      candidate.forEach(e => this.cells[e].occupied = true);
      return this.cells[candidate[0]];
    }
    // const testCells = this.cells.filter(c => c.occupied == true);
    //         console.log('occupied cells',testCells); 
    return [0,0]
  }
}

//grid.init();