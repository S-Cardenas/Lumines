/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Field = __webpack_require__(1);

	var canvas = document.getElementById('myCanvas'),
	    ctx = canvas.getContext("2d"),
	    field = new Field(canvas),
	    img = new Image(),
	    fps = 15;

	img.src = './assets/images/background.jpg';



	function init() {
	  ctx.clearRect(0, 0, canvas.width, canvas.height);
	  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

	  field.drawScore();
	  field._populateNextBricks();
	  field.createNewBrick();
	  field._addBrickToField();
	  field.drawNextBricks();
	  field.drawField();
	  field.drawBlocks();
	  field.drawLine();
	  field.autoMoveBricks();
	  field.moveLine();
	  setTimeout(function(){
	    requestAnimationFrame(init);}, 1000 / fps);

	}

	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	$('.play-button').click(function() {
	  $('.menu').attr("class", "noMenu");
	  field.pause = false;
	  document.addEventListener("keydown", field.keyDownHandler.bind(field), false);
	  init();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Bricks = __webpack_require__(2);

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
	  this.paused = true;
	  this.lineX = 120; // X coordinate of the clearing line
	  this.level = Math.floor(Math.random() * (5 - 0 + 1)) + 0; // Line speed
	  this.lineSweeps = 0; //Counts the number of line sweeps
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

	    //draw the level title
	    ctx.beginPath();
	    ctx.font = "30px serif";
	    ctx.fillStyle = 'white';
	    ctx.fillText('Speed', 630, 200);
	    ctx.closePath();

	    //draw the level value
	    ctx.beginPath();
	    ctx.font = "30px serif";
	    ctx.fillStyle = 'white';
	    ctx.fillText(this.level, 630, 240);
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
	      this.lineSweeps++;
	      if (this.lineSweeps % 3 === 0) {
	        this.level = Math.floor(Math.random() * (5 - 0 + 1)) + 0;
	      }
	      this.lineX = 120;
	    }
	    else {this.lineX += 2 + this.level;}
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Block = __webpack_require__(3);

	function Bricks() {
	  // array that holds the brick elements
	  this.all = new Array();
	  this.gridWidth = 16;
	  this.gridHeight = 12;
	  this.spacePressed = false;
	  //populate the bricks with individual blocks
	  for (let i = 0; i < 2; i++) {
	    for (let j = 0; j < 2; j++) {
	      let block = new Block();
	      block.x = (this.gridWidth / 2) + i;
	      block.xV = (this.gridWidth / 2) + i;
	      block.y = j; // y is the location on the grid
	      block.yV = j; //yV is the pixel location in Canvas
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
	      else if (!this.spacePressed) {this._updateGrid(block, grid, 1);}
	      else if (this.spacePressed) {
	        if (!this._moveBelowBottom(block, 3)) {
	          if (this._blockBeneath(block, grid, 3)) {
	            this._updateGrid(block, grid, 2);
	          }
	          else {this._updateGrid(block, grid, 3);}
	        }
	        else if(this._moveBelowBottom(block, 3)) {
	          if (this._blockBeneath(block, grid, 3)) {
	            this._updateGrid(block, grid, 2);
	          }
	          else {this._updateGrid(block, grid, 4);}
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
	      if (this._atBottom(block)) {continue;}
	      else if (!this._blockBeneath(block, grid, 1)) {return false;}
	    }
	    return true;
	  };

	  //check if the active brick can't move from the top of grid (ie GAME OVER)
	  this._gameOver = function(grid) {
	    let order = [1, 3];
	    for (let i = 0; i < order.length; i++) {
	      let block  = this.all[order[i]];
	      if (block.y < 2 && this._blockBeneath(block, grid, 1)) {
	        document.location.reload();
	        break;
	      }
	    }
	  };

	  //mark all the blocks in current activeBrick as inactive
	  this._setBlocksInactive = function() {
	    for (let i = 0; i < this.all.length; i++) {
	      this.all[i].active = false;
	    }
	  };

	  //check if the blocks are split
	  this._brickSplit = function(grid) {
	    if (this.all[1].y !== this.all[3].y) {return true;}
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

	    return false;
	  };

	// check if there is a block beneath at a distance of 'inc'
	  this._blockBeneath = function(block, grid, inc) {
	    let x = block.x,
	        y = block.y,
	        limit = y + inc + 1;

	    if (limit > 11) {limit = 12;}
	    for (let i = y + 1; i < limit; i++) {
	      if (grid[i][x] !== 0) {return true;}
	    }
	    return false;
	  };

	  //find the y coordinate of the next block directly below
	  this._nextBlockY = function(block, grid) {
	    let x = block.x,
	        y = block.y;
	    for (let i = y + 1; i < this.gridHeight; i++) {
	      if (grid[i][x] !== 0) {return grid[i][x];}
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
	        block.yV += 0.1;
	        if (block.yV.toFixed(2) % 1 === 0) {block.y++;}
	        grid[block.y][block.x] = block;
	        grid[oldY][oldX] = 0;
	        break;
	      case 2:
	        //there is a block below current block. move current block on top of
	        //block below.
	        let existingBlockY = this._nextBlockY(block, grid);
	        block.y += (existingBlockY.y - block.y - 1);
	        block.yV = block.y + (existingBlockY.yV - existingBlockY.y);
	        grid[block.y][block.x] = block;
	        grid[oldY][oldX] = 0;
	        break;
	      case 3:
	        //block is incrementing at a rate of 3 vertical locations
	        block.y += 1;
	        block.yV += 1;
	        grid[block.y][block.x] = block;
	        grid[oldY][oldX] = 0;
	        break;
	      case 4:
	        //block is moving to the bottom of the grid
	        block.y += ((this.gridHeight - 1) - block.y);
	        block.yV = block.y;
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


/***/ },
/* 3 */
/***/ function(module, exports) {

	function Block() {
	  this.gridWidth = 16;
	  this.gridHeight = 12;
	  this.x = undefined;
	  this.y = undefined; // y is the location on the grid
	  this.xV = undefined; //yV is the pixel location in Canvas
	  this.yV = undefined;
	  this.color = undefined;
	  this.active = true;
	  this.markedForDeletion = false;

	  //Move block on each rendering
	  this._autoMove = function(grid) {
	    if (!this._stoppedMoving(grid)) {
	      if (!this._moveBelowBottom(4)) {
	        if (this._blockBeneath(grid, 4)) {this._updateGrid(grid, 2);}
	        else {this._updateGrid(grid, 3);}
	      }
	      else if (this._moveBelowBottom(4)) {
	        if (this._blockBeneath(grid, 4)) {this._updateGrid(grid, 2);}
	        else {this._updateGrid(grid, 4);}
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
	        this.yV = this.y;
	        grid[this.y][this.x] = this;
	        grid[oldY][oldX] = 0;
	        break;
	      case 3:
	        //block is incrementing at a rate of 4 vertical locations
	        this.y += 1;
	        this.yV = this.y;
	        grid[this.y][this.x] = this;
	        grid[oldY][oldX] = 0;
	        break;
	      case 4:
	        //block is to be moved to the bottom of the grid
	        this.y += ((this.gridHeight - 1) - this.y);
	        this.yV = this.y;
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
	  this.updateDeletionStatus = function(grid, lineX) {
	    let status = true;
	    let lineConversion = ((1/32) * lineX) - (15/4);
	    if (lineConversion >= this.x && lineConversion <= this.x + 1) {
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


/***/ }
/******/ ]);