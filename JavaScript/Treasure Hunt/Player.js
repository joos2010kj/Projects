class Player {
  constructor(i, j) {
    this.pos = {
      i,
      j
    };

    Player.point = 0;

    this.scoreboard = document.getElementById('score');
  }

  action(key) {
    let prev = {i: this.pos.i, j: this.pos.j};
    let moved = true;

    this.map[this.pos.i][this.pos.j] =
    this.map[this.pos.i][this.pos.j] == 2 ? 0 : 1;

    if (key == RIGHT_ARROW || key == 'D') {
      if (this.canCross(this.pos.i, this.adjust(this.pos.j + 1))) {
        this.pos.j++;
        this.pos.j = this.adjust(this.pos.j);
      }
    }

    if (key == LEFT_ARROW || key == 'A') {
      if (this.canCross(this.pos.i, this.adjust(this.pos.j - 1))) {
        this.pos.j--;
        this.pos.j = this.adjust(this.pos.j);
      }
    }

    if (key == UP_ARROW || key == 'W') {
      if (this.canCross(this.adjust(this.pos.i - 1), this.pos.j)) {
        this.pos.i--;
        this.pos.i = this.adjust(this.pos.i);
      }
    }

    if (key == DOWN_ARROW || key == 'S') {
      if (this.canCross(this.adjust(this.pos.i + 1), this.pos.j)) {
        this.pos.i++;
        this.pos.i = this.adjust(this.pos.i);
      }
    }

    if (prev.i == this.pos.i && prev.j == this.pos.j)
      moved = false;

    this.map[this.pos.i][this.pos.j] =
    this.map[this.pos.i][this.pos.j] != 0 ? 3 : 2;

    this.scoreboard.innerHTML = "TREASURES COLLECTED: " + Player.point;
  }

  canCross(i, j) {
    if (this.map[i][j] == 0) { //UNCROSSABLE
      return false;
    }

    if (this.map[i][j] == 4) { //TREASURE
      Player.point++;
    }

    return true;
  }

  adjust(coord) {
    return (coord + this.map.length) % this.map.length;
  }
}
