class Monster {
  constructor(i, j) {
    this.pos ={
      i, j
    };
  }

  update() {
    let { i, j } = this.nextMove();
    let data =
           {pre:  {
                  i: this.pos.i,
                  j: this.pos.j
                  },
            post: {
                  i: this.adjust(this.pos.i + i),
                  j: this.adjust(this.pos.j + j)
                  }
           };

    //this.pos.i = data.post.i;
    //this.pos.j = data.post.j;

    return data;
  }

  nextMove() {
    let chance = Math.random();
    let direction = {i: 0, j: 0};

    if (chance < 0.2) { // 80% Stay still
      chance = Math.random();

      if (chance > 0.75) { //UP
        direction.i--;
      } else if (chance > 0.5) { //RIGHT
        direction.j++;
      } else if (chance > 0.25) { //DOWN
        direction.i++;
      } else { //LEFT
        direction.j--;
      }
    }

    return direction;
  }

  adjust(coord) {
    return (coord + Monster.mapSize) % Monster.mapSize;
  }


}
