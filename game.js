const Field = require('./field');

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext("2d");
var field = new Field(canvas);


document.addEventListener("keydown", field.keyDownHandler.bind(field), false);

function init() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  field.drawScore();
  field._populateNextBricks();
  field.createNewBrick();
  field._addBrickToField();
  field.drawNextBricks();
  field.drawField();
  field.autoMoveBricks();
}

setInterval(init, 150);
