const Field = require('./field');
const Bricks = require('./bricks');

var canvas = document.getElementById('myCanvas');
var field = new Field(canvas);
field.createNewBrick();
field.addBrickToField();
field.drawField();
