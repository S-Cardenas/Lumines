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
