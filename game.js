const Field = require('./field');

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext("2d");
var field = new Field(canvas);
var img = new Image();
img.src = './background.jpg';
var fps = 6;

document.addEventListener("keydown", field.keyDownHandler.bind(field), false);

function init() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  field.drawScore();
  field._populateNextBricks();
  field.createNewBrick();
  field._addBrickToField();
  field.drawNextBricks();
  field.drawField();
  field.drawLine();
  field.autoMoveBricks();
  field.moveLine();
  setTimeout(function(){
    requestAnimationFrame(init);}, 1000 / fps);

}

init();
