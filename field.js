const Bricks = require('./bricks');

function Field(canvas) {
  this.width = 16;
  this.height = 12;
  this.grid = new Array();
  this.cellSize = 30;
  this.leftOffset = 120;
  this.rightOffset = 30;
  this.topOffset = 60;
  this.bottomOffset = 60;
  this.activeBrick = undefined;
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

  //Create a new active brick if there is none
  this.createNewBrick = function() {
    if (!this.activeBrick) {
      let newBricks = new Bricks();
      this.activeBrick = newBricks;
    }
  };

  //Add new brick to the field
  this.addBrickToField = function() {
    for (let i = 0; i < 4; i++) {
      let x = this.activeBrick.all[i].x;
      let y = this.activeBrick.all[i].y;
      this.grid[y][x] = this.activeBrick.all[i];
    }
  };

  // handler for user input
  this.keyDownHandler = function(e) {
    this.grid = this.activeBrick.keyDownHandler(e, this.grid);
  };

  //automatically move the bricks;
  this.autoMoveBricks = function() {
    this.grid = this.activeBrick.autoMove(this.grid);
  };
}

module.exports = Field;
