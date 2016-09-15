const Bricks = require('./bricks');

function Field(canvas) {
  this.width = 16;
  this.height = 12;
  this.grid = new Array();
  this.cellSize = 30;
  this.leftOffset = 120;
  this.nextBricksLeftOffset = 30;
  this.rightOffset = 30;
  this.topOffset = 60;
  this.bottomOffset = 60;
  this.activeBrick = undefined;
  this.nextBricks = [];
  this.spacePressed = false;
  let ctx = canvas.getContext('2d');

  //Initialize the field as empty
  for (let i = 0; i < this.height; i++) {
    this.grid[i] = new Array();
    for (let j = 0; j < this.width; j++) {
      this.grid[i][j] = 0;
    }
  }

  //Draw the field
  this.drawField = function() {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        if (!this.grid[i][j] && i > 1) {
          ctx.beginPath();
          ctx.strokeStyle = 'black';
          ctx.rect((this.leftOffset + (j * this.cellSize)),
          (this.topOffset + (i * this.cellSize)), this.cellSize, this.cellSize);
          ctx.stroke();
          ctx.closePath();
        }
        else if (this.grid[i][j]) {
          ctx.beginPath();
          ctx.strokeStyle = 'black';
          if (this.grid[i][j].color === 1) {
            ctx.fillStyle = 'red';
          }
          else {
            ctx.fillStyle = 'blue';
          }
          ctx.rect((this.leftOffset + (this.grid[i][j].x * this.cellSize)),
            (this.topOffset + (this.grid[i][j].y * this.cellSize)),
            this.cellSize, this.cellSize);
          ctx.stroke();
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  };

  //Draw the next bricks array on the left side
  this.drawNextBricks = function() {
    let offset = 90;
    for (let k = 0; k < this.nextBricks.length; k++) {
      let brick = this.nextBricks[k];
      for (let m = 0; m < brick.all.length; m++) {
        let i = undefined,
            j = undefined;
        (m < 2) ? i = 0 : i = 1;
        (m % 2 === 0) ? j = 0 : j = 1;
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        // console.log(brick);
        (brick.all[m].color === 1) ? ctx.fillStyle = 'red' : ctx.fillStyle = 'blue';
        ctx.rect((this.nextBricksLeftOffset + i * 30),
                (this.topOffset + (offset * k) + (j * 30)),
                this.cellSize,
                this.cellSize);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
      }
    }
  };

  //Create a new active brick if there is none
  this.createNewBrick = function() {
    if (!this.activeBrick) {
      // let newBricks = new Bricks();
      this.activeBrick = this.nextBricks.shift();
    }
  };

  //create the next bricks that will be visible on the left side
  this._populateNextBricks = function() {
    while (this.nextBricks.length < 3) {
      let brick = new Bricks();
      this.nextBricks.push(brick);
    }
  };

  //Add new brick to the field
  this._addBrickToField = function() {
    for (let i = 0; i < 4; i++) {
      let x = this.activeBrick.all[i].x;
      let y = this.activeBrick.all[i].y;
      this.grid[y][x] = this.activeBrick.all[i];
    }
    this.activeBrick._gameOver(this.grid);
  };

  // handler for user input
  this.keyDownHandler = function(e) {
    if (!this.activeBrick._brickSplit(this.grid)) {
      this.grid = this.activeBrick.keyDownHandler(e, this.grid);
    }
  };

  //automatically move the bricks;
  this.autoMoveBricks = function() {
    if (this.activeBrick._stoppedMoving(this.grid)) {
      this.activeBrick._setBlocksInactive();
      this.activeBrick = undefined;
      this._checkBlocksForDeletion();
      this._deleteBlocks();
    }
    if (this.activeBrick) {
      this.grid = this.activeBrick.autoMove(this.grid);
      // let locations = [];
      // for (let i = 0; i < this.activeBrick.all.length; i++) {
      //
      // }
      for (let i = 2; i < this.height - 1; i++) {
        for (let j = 0; j < this.width; j++) {
          if (this.grid[i][j] !== 0 && !this.grid[i][j].active) {
            this.grid = this.grid[i][j]._autoMove(this.grid);
          }
        }
      }
    }
  };

  //check which blocks need to be deleted
  this._checkBlocksForDeletion = function() {
    for (let i = 2; i < this.height - 1; i++) {
      for (let j = 0; j < this.width - 1; j++) {
        if (this.grid[i][j] !== 0) {
          this.grid[i][j].updateDeletionStatus(this.grid);
        }
      }
    }
  };

  // delete blocks that have been marked for deletion
  this._deleteBlocks = function() {
    for (let i = 2; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        if (this.grid[i][j].markedForDeletion) {
          this.grid[i][j] = 0;
        }
      }
    }
  };

}


module.exports = Field;
