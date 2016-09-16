const Field = require('./field');

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext("2d");
var field = new Field(canvas);
var fps = 5;

document.addEventListener("keydown", field.keyDownHandler.bind(field), false);

function init() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  field.drawLine();
  field.drawScore();
  field._populateNextBricks();
  field.createNewBrick();
  field._addBrickToField();
  field.drawNextBricks();
  field.drawField();
  field.autoMoveBricks();
  field.moveLine();
  setTimeout(function(){
    requestAnimationFrame(init);}, 1000 / fps);

}

init();
