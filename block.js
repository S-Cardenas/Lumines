function Block() {
  this.gridWidth = 16;
  this.gridHeight = 12;
  this.x = undefined;
  this.y = undefined;
  this.color = undefined;
  this.active = true;
  this.markedForDeletion = false;



  //Move block on each rendering
  this._autoMove = function(grid) {
    if (!this._stoppedMoving(grid)) {
      if (!this._moveBelowBottom(4)) {

        if (this._blockBeneath(grid, 4)) {
          this._updateGrid(grid, 2);
        }
        else {
          this._updateGrid(grid, 3);
        }
      }
      else if (this._moveBelowBottom(4)) {
        if (this._blockBeneath(grid, 4)) {
          this._updateGrid(grid, 2);
        }
        else {
          this._updateGrid(grid, 4);
        }
      }
    }
    return grid;
  };

  //update the grid and block based on new location
  this._updateGrid = function(grid, key) {
    let oldX = this.x,
        oldY = this.y;
    switch(key) {
      case 2:
        // there is a block below current block. Move on top of it
        let existingBlockY = this._nextBlockY(grid);
        this.y += (existingBlockY - this.y - 1);
        grid[this.y][this.x] = this;
        grid[oldY][oldX] = 0;
        break;
      case 3:
        //block is incrementing at a rate of 4 vertical locations
        this.y += 4;
        grid[this.y][this.x] = this;
        grid[oldY][oldX] = 0;
        break;
      case 4:
        //block is to be moved to the bottom of the grid
        this.y += ((this.gridHeight - 1) - this.y);
        grid[this.y][this.x] = this;
        grid[oldY][oldX] = 0;
        break;
    }
  };

  this._nextBlockY = function(grid) {
    let x = this.x,
        y = this.y;
    for (let i = y + 1; i < this.gridHeight; i++) {
      if (grid[i][x] !== 0) {return i;}
    }
    return false;
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

    if (limit > this.gridHeight - 1) {limit = this.gridHeight;}
    for (let i = y + 1; i < limit; i++) {
      if (grid[i][x] !== 0) {return true;}
    }
    return false;
  };

  //check if the next movement will put you below the bottom
  this._moveBelowBottom = function(inc) {
    if (this.y + inc > this.gridHeight - 1) {return true;}
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
