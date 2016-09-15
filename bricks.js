const Block = require('./block');

function Bricks() {
  // array that holds the brick elements
  this.all = new Array();
  this.gridWidth = 16;
  this.gridHeight = 12;
  this.spacePressed = false;
  //populate the bricks with individual Bricks
  let ps = -1;
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      let block = new Block();
      block.x = (this.gridWidth / 2) + i;
      block.y = j;
      block.color = Math.floor(Math.random() * (3 - 1)) + 1;
      this.all.push(block);
    }
  }
  this.autoMove = function(grid) {
    //check condition for moving a block
    //first check bottom blocks, then top blocks
    //1) are we at bottom of grid?
    //2) is there a block underneath?
    //order of checking [1,3,0,2]
    let order = [1,3,0,2];
    for (let i = 0; i < order.length; i++) {
      let block = this.all[order[i]];
      if (this._atBottom(block) || this._blockBeneath(block, grid, 1)) {continue;}
      else if (!this.spacePressed) {
        this._updateGrid(block, grid, 1);
      }
      else if (this.spacePressed) {
        if (!this._moveBelowBottom(block, 3)) {
          if (this._blockBeneath(block, grid, 3)) {
            this._updateGrid(block, grid, 2);
          }
          else {
            this._updateGrid(block, grid, 3);
          }
        }
        else if(this._moveBelowBottom(block, 3)) {
          if (this._blockBeneath(block, grid, 3)) {
            this._updateGrid(block, grid, 2);
          }
          else {
            this._updateGrid(block, grid, 4);
          }
        }
      }
    }
    return grid;
  };

  //check if the activeBrick has stopped moving
  this._stoppedMoving = function(grid) {
    let order = [1, 3, 0, 2];
    for (let i = 0; i < order.length; i++) {
      let block = this.all[order[i]];
      if (this._atBottom(block)) {
        continue;
      }
      else if (!this._blockBeneath(block, grid, 1)) {

        return false;
      }
    }
    return true;
  };

  //mark all the blocks as inactive
  this._setBlocksInactive = function() {
    for (let i = 0; i < this.all.length; i++) {
      this.all[i].active = false;
    }
  };

  //check if the blocks are split
  this._brickSplit = function(grid) {
    if (this.all[1].y !== this.all[3].y) {
      return true;
    }
    return false;
  };

  // check if the block is moving below the bottom
  this._moveBelowBottom = function(block, inc) {
    if (block.y + inc > this.gridHeight - 1) {return true;}
    else {return false;}
  };

  // check if block is at bottom
  this._atBottom = function(block) {
    if (block.y > 10) {
      return true;
    }
    else {
      return false;
    }
  };

// check if there is a block beneath at a distance of 'inc'
  this._blockBeneath = function(block, grid, inc) {
    let x = block.x,
        y = block.y,
        limit = y + inc + 1;

    if (limit > 11) {limit = 12;}
    for (let i = y + 1; i < limit; i++) {
      if (grid[i][x] !== 0) {

        return true;
      }
    }
    return false;
  };

  //find the y coordinate of the next block directly below
  this._nextBlockY = function(block, grid) {
    let x = block.x,
        y = block.y;
    for (let i = y + 1; i < this.gridHeight; i++) {
      if (grid[i][x] !== 0) {return i;}
    }
    return false;
  };

  //update the grid and block based on new brick location
  this._updateGrid = function(block, grid, key) {
    let oldX = block.x,
        oldY = block.y;
    switch(key) {
      case 1:
        //block is just falling vertically by one position
        block.y++;
        grid[block.y][block.x] = block;
        grid[oldY][oldX] = 0;
        break;
      case 2:
        //there is a block below current block. move current block on top of
        //block below.
        let existingBlockY = this._nextBlockY(block, grid);
        block.y += (existingBlockY - block.y - 1);
        grid[block.y][block.x] = block;
        grid[oldY][oldX] = 0;
        break;
      case 3:
        //block is incrementing at a rate of 3 vertical locations
        block.y += 3;
        grid[block.y][block.x] = block;
        grid[oldY][oldX] = 0;
        break;
      case 4:
        //block is moving to the bottom of the grid
        block.y += ((this.gridHeight - 1) - block.y);
        grid[block.y][block.x] = block;
        grid[oldY][oldX] = 0;
        break;
    }
  };

  this.keyDownHandler = function(e, grid) {
    // displace active brick one unit to the left
    if (e.keyCode === 37 && this.all[0].x > 0) {

      if (grid[this.all[0].y][this.all[0].x - 1] !== 0) {return grid;}
      let oldX = this.all[3].x,
          oldY1 = this.all[2].y,
          oldY2 = this.all[3].y;
      for (let i = 0; i < 4; i++) {
        this.all[i].x--;
      }
      grid[oldY1][oldX] = 0;
      grid[oldY2][oldX] = 0;
      return grid;
    }
    // displace active brick unit to the right
    else if (e.keyCode === 39 && this.all[3].x < 15) {
      if (grid[this.all[3].y][this.all[3].x + 1] !== 0) {return grid;}
      let oldX = this.all[0].x,
          oldY1 = this.all[0].y,
          oldY2 = this.all[1].y;
      for (let i = 0; i < 4; i++) {
        this.all[i].x++;
      }
      grid[oldY1][oldX] = 0;
      grid[oldY2][oldX] = 0;
      return grid;
    }
    // rotate the active brick counter-clockwise
    else if (e.keyCode === 38) {
      let colors = [];
      colors[0] = this.all[2].color; colors[1] = this.all[0].color;
      colors[2] = this.all[3].color; colors[3] = this.all[1].color;
      for (let i = 0; i < 4; i++) {
        this.all[i].color = colors[i];
      }
      return grid;
    }
    // rotate the active brick clock-wise
    else if (e.keyCode === 40) {
      let colors = [];
      colors[0] = this.all[1].color; colors[1] = this.all[3].color;
      colors[2] = this.all[0].color; colors[3] = this.all[2].color;
      for (let i = 0; i < 4; i++) {
        this.all[i].color = colors[i];
      }
      return grid;
    }
    else if(e.keyCode === 32) {
      this.spacePressed = true;
      return grid;
    }
    else {
      return grid;
    }
  };
}

module.exports = Bricks;
