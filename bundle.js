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
	  field.addBrickToField();
	  field.drawField();
	  // setInterval(field.autoMoveBricks.bind(field), 300);
	  field.autoMoveBricks();
	}

	setInterval(init, 100);


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


/***/ },
/* 2 */
/***/ function(module, exports) {

	function Bricks() {
	  // array that holds the brick elements
	  this.all = new Array();
	  this.gridWidth = 16;
	  this.spacePressed = false;
	  //populate the bricks with individual Bricks
	  let ps = -1;
	  for (let i = 0; i < 2; i++) {
	    for (let j = 0; j < 2; j++) {
	      ps ++;
	      this.all.push({x : (this.gridWidth/2 + i),
	        y: j,
	        active: true,
	        pos: ps,
	        color: Math.floor(Math.random() * (3 - 1)) + 1});
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
	      if (this._atBottom(block)) {
	        continue;}
	      else if (!this._blockBeneath(block, grid)) {
	        let oldX = block.x;
	        let oldY = block.y;
	        if (this.spacePressed) {
	          block.y += 3;
	        }
	        else {
	          block.y++;
	        }
	        grid[oldY][oldX] = 0;
	      }
	    }
	    return grid;
	  };

	  this._atBottom = function(block) {
	    if (block.y > 10) {
	      return true;
	    }
	    else {
	      return false;
	    }
	  };

	  this._blockBeneath = function(block, grid) {
	    let x = block.x,
	        y = block.y;

	    if (grid[y + 1][x] !== 0) {
	      return true;
	    }
	    else {
	      return false;
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


/***/ }
/******/ ]);