function Block() {
  this.gridWidth = 16;
  this.gridHeight = 12;
  this.x = undefined;
  this.y = undefined;
  this.color = undefined;
  this.markedForDeletion = false;



  //Move block on each rendering
  this._autoMove = function(grid) {

  };

  //check if block is at bottom of grid
  this._atBottom = function() {
    if (this.y > 10) {return true;}
    return false;
  };

  //check if there is another block at a distance (inc) below current block
  this._blockBeneath = function(grid, inc) {
    let x = this.x,
        y = this.y,
        limit = y + inc + 1;
        // console.log('here');
        console.log(grid);

    if (limit > 11) {limit = 12;}
    for (let i = y + 1; i < limit; i++) {
      console.log('i:');
      console.log(i);
      if (grid[i][x] !== 0) {return true;}
    }
    return false;
  };

  // check if current block makes a same-color square in the grid
  this.updateDeletionStatus = function(grid) {
    let status = true;
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        if (i === 0 && j === 0) {continue;}
        else if (this.color !== grid[this.y + i][this.x + j].color || !grid[this.y + i][this.x + j]._stoppedMoving(grid)) {
          status = false;
          break;
        }
      }
    }
    if (status) {
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          grid[this.y + i][this.x + j].markedForDeletion = true;
        }
      }
    }
  };

  //check if block has stopped moving
  this._stoppedMoving = function(grid) {
    if (this._atBottom() || this._blockBeneath(grid, 1)) {
      return true;
    }
    return false;
  };
}

module.exports = Block;
