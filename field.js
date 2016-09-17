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
  this.score = 0;
  this.lineX = 120;
  let ctx = canvas.getContext('2d');

  //Initialize the field as empty
  for (let i = 0; i < this.height; i++) {
    this.grid[i] = new Array();
    for (let j = 0; j < this.width; j++) {
      this.grid[i][j] = 0;
    }
  }

  //Draw the field grid
  this.drawField = function() {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        if (i > 1) {
          ctx.beginPath();
          ctx.strokeStyle = '#E6E6FA';
          ctx.rect((this.leftOffset + (j * this.cellSize)),
          (this.topOffset + (i * this.cellSize)), this.cellSize, this.cellSize);
          ctx.stroke();
          ctx.closePath();
        }
      }
    }
  };

  //draw the blocks
  this.drawBlocks = function() {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        if (this.grid[i][j]) {
          let block = this.grid[i][j];
          ctx.beginPath();
          ctx.strokeStyle = '#E6E6FA';
          if (block.color === 1 && !block.markedForDeletion) {
            ctx.fillStyle = 'orange';
          }
          else if (block.color === 1 && block.markedForDeletion) {
            ctx.fillStyle = '#FF4500';
          }
          else if (block.color === 2 && !block.markedForDeletion) {
            ctx.fillStyle = 'white';
          }
          else if (block.color === 2 && block.markedForDeletion) {
            ctx.fillStyle = '#1E90FF';
          }
          ctx.rect((this.leftOffset + (block.x * this.cellSize)),
            (this.topOffset + (block.yV * this.cellSize)),
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
        ctx.strokeStyle = '#E6E6FA';
        (brick.all[m].color === 1) ? ctx.fillStyle = 'orange' : ctx.fillStyle = 'white';
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

  //draw the score
  this.drawScore = function() {
    //draw the score title
    ctx.beginPath();
    ctx.font = "30px serif";
    ctx.fillStyle = 'white';
    ctx.fillText('Score:', 630, 120);
    ctx.closePath();

    //draw the score value
    ctx.beginPath();
    ctx.font = "30px serif";
    ctx.fillStyle = 'white';
    ctx.fillText(this.score, 630, 160);
    ctx.closePath();

  };

  //draw the line which moves across the field
  this.drawLine = function() {
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.moveTo(this.lineX, 106);
    ctx.lineWidth = 5;
    ctx.lineTo(this.lineX, 420);
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.closePath();

    //draw the top triangle
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.moveTo(this.lineX, 120);
    ctx.lineTo(this.lineX + 15, 112.5);
    ctx.lineTo(this.lineX, 105);
    ctx.fill();
    ctx.closePath();
  };

  //move the line across the field
  this.moveLine = function() {
    this._checkBlocksForDeletion();
    if (this.lineX >= 600) {

      this._deleteBlocks();
      this.lineX = 120;
    }
    else {this.lineX += 5;}
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

  //automatically move the bricks/blocks
  this.autoMoveBricks = function() {
    //check if the active brick has stopped moving and inactivate it
    if (this.activeBrick._stoppedMoving(this.grid)) {
      this.activeBrick._setBlocksInactive();
      this.activeBrick = undefined;
    }
    //first move the activeBrick (the one that the user can control)
    //then move the inactive bricks/blocks
    if (this.activeBrick) {
      this.grid = this.activeBrick.autoMove(this.grid);
      //automove each individual block
      for (let i = (this.height - 1); i > 1; i--) {
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
        if (this.grid[i][j] !== 0 && !this.grid[i][j].active) {
          this.grid[i][j].updateDeletionStatus(this.grid, this.lineX);
        }
      }
    }
  };

  // delete blocks that have been marked for deletion
  this._deleteBlocks = function() {
    let tempScore = 0;
    for (let i = 2; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        let block = this.grid[i][j];
        if (block.markedForDeletion) {
          tempScore += 1;
          this.grid[i][j] = 0;
        }
      }
    }
    this.score += tempScore * (tempScore / 4);
  };

}


module.exports = Field;
