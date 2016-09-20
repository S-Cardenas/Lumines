const Field = require('./field');

var canvas = document.getElementById('myCanvas'),
    ctx = canvas.getContext("2d"),
    field = new Field(canvas),
    img = new Image(),
    fps = 15;

img.src = './background.jpg';



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
