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
	const Bricks = __webpack_require__(2);

	var canvas = document.getElementById('myCanvas');
	var field = new Field(canvas);
	field.createNewBrick();
	field.addBrickToField();
	field.drawField();


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
	}

	module.exports = Field;


/***/ },
/* 2 */
/***/ function(module, exports) {

	function Bricks() {
	  // array that holds the brick elements
	  this.all = new Array();
	  this.gridWidth = 16;
	  //populate the bricks with individual Bricks
	  let ps = -1;
	  for (let i = 0; i < 2; i++) {
	    for (let j = 0; j < 2; j++) {
	      ps ++;
	      this.all.push({x : (this.gridWidth/2 + i),
	        y : j,
	        active : true,
	        pos: ps,
	        color: Math.floor(Math.random() * (3 - 1)) + 1});
	    }
	  }
	}

	module.exports = Bricks;


/***/ }
/******/ ]);