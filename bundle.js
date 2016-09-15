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

	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext("2d");
	var field = new Field(canvas);


	document.addEventListener("keydown", field.keyDownHandler.bind(field), false);

	function init() {
	  ctx.clearRect(0, 0, canvas.width, canvas.height);

	  field.createNewBrick();
	  field._addBrickToField();
	  field.drawField();
	  field.autoMoveBricks();
	}

	setInterval(init, 250);


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
	  this._addBrickToField = function() {
	    for (let i = 0; i < 4; i++) {
	      let x = this.activeBrick.all[i].x;
	      let y = this.activeBrick.all[i].y;
	      this.grid[y][x] = this.activeBrick.all[i];
	    }
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
	      this.activeBrick = undefined;
	      this._checkBlocksForDeletion();
	      this._deleteBlocks();
	    }
	    if (this.activeBrick) {this.grid = this.activeBrick.autoMove(this.grid);}
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


/***/ },
/* 3 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);