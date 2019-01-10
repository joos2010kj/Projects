class Map {
  constructor(size, sca) {
    this.size = size;
    this.scale = sca;
    this.treasure_div = document.getElementById('treasures');
    this.total_div = document.getElementById('total');

    this.gameOfLife();
    this.evolve();
    this.filter();

    this.placePlayer();
    this.categorize();

    this.placeTreasure();
    this.placeMonster();
  }

  gameOfLife() {
    this.survival = [];

    this.chanceOfSurvival = 0.7;
    this.mapSize = this.scale;

    for (let i = 0; i < this.mapSize; i++) {
      this.survival.push
      (new Array(this.mapSize).fill(null).map
        ((x) => Math.random() < this.chanceOfSurvival)
      );
    }

    this.survivalCopy = [];

    for (let i = 0; i < this.mapSize; i++) {
      this.survivalCopy.push([]);
      for (let j = 0; j < this.mapSize; j++) {
        this.survivalCopy[i].push(this.survival[i][j]);
      }
    }
  }

  evolve() {
    let generation = 0;

    do {
      let newArr = [];

      for (let i = 0; i < this.mapSize; i++) {
        newArr.push([]);
        for (let j = 0; j < this.mapSize; j++) {
          newArr[i].push(null);
        }
      }

      for (let i = 0; i < this.mapSize; i++) {
        for (let j = 0; j < this.mapSize; j++) {
          newArr[i][j] = this.checkIfStillAlive
              (this.countSurvivors(this.survival, i, j));
        }
      }

      for (let i = 0; i < this.mapSize; i++) {
        for (let j = 0; j < this.mapSize; j++) {
          newArr[i][j] = this.survivalCopy[i][j]^newArr[i][j] && this.survival[i][j];
        }
      }

      this.survival = newArr;

      generation++;
    } while(generation < 50);
  }

  filter() {
    for (let i = 1; i < this.mapSize - 1; i++) {
      for (let j = 1; j < this.mapSize - 1; j++) {
        let curr = this.survival[i][j];

        if (!curr) {
          if (this.survival[i - 1][j] &&
              this.survival[i + 1][j] &&
              this.survival[i][j - 1] &&
              this.survival[i][j + 1])
              this.survival[i][j] = true;
        } else {
          if (!this.survival[i - 1][j] &&
              !this.survival[i + 1][j] &&
              !this.survival[i][j - 1] &&
              !this.survival[i][j + 1])
              this.survival[i][j] = false;
        }
      }
    }
  }

  placePlayer() {
    let i, j;
    while (true) {
      i = floor(random(1, this.mapSize - 1));
      j = floor(random(1, this.mapSize - 1));

      let curr = this.survival[i][j];

      if (curr) {
        if (this.survival[i - 1][j] &&
            this.survival[i + 1][j] &&
            this.survival[i][j - 1] &&
            this.survival[i][j + 1] &&
            this.survival[i - 1][j - 1] &&
            this.survival[i - 1][j + 1] &&
            this.survival[i + 1][j - 1] &&
            this.survival[i + 1][j + 1]) {
              this.player = new Player(i, j);
              console.log(i, j);
              return;
            }
      }
    }
  }

  categorize() {
          //0 : SEA (UNCROSSABLE) - WHITE
          //1 : OPEN SPACE        - BLACK
          //2 : PLAYER (SEA)      - BLUE
          //3 : PLAYER (OS)       - GREEN
    this.map = [];

    for (let i = 0; i < this.mapSize; i++) {
      this.map.push([]);
      for (let j = 0; j < this.mapSize; j++) {
        this.map[i].push(null);
      }
    }

    for (let i = 0; i < this.mapSize; i++) {
      for (let j = 0; j < this.mapSize; j++) {
        if (!this.survival[i][j]) {
          this.map[i][j] = 0;
        } else {
          this.map[i][j] = 1;
        }
      }
    }

    this.map[this.player.pos.i][this.player.pos.j] = 3;

    this.player.map = this.map;
  }

  placeTreasure() {
    let i, j;
    let counter = 0;
    let set = new Set();

    this.treasures = [];

    while (counter < 10) {
      i = floor(random(1, this.mapSize - 1));
      j = floor(random(1, this.mapSize - 1));

      let curr = this.survival[i][j];

      if (curr) {
        let num = this.countSurvivors(this.survival, i, j).count;
        if (num >= 2 && num < 5) {
          if (!set.has(i * j)) {
            this.treasures.push({i, j});
            this.map[i][j] = 4;
            set.add(i * j);
          }
          counter++;
        }
      }
    }

    this.treasureCount = this.treasures.length;
    this.percent = 100 / this.treasureCount;
    //console.log(this.treasures.length, this.treasures);
  }

  placeMonster() {
    let i, j;
    let counter = 0;
    this.monsters = [];
    Monster.mapSize = this.mapSize;

    while (counter < 10) {
      i = floor(random(0, this.mapSize));
      j = floor(random(0, this.mapSize));

      let code = this.map[i][j];

      if (code == 1) {
        this.map[i][j] = 5;
        this.monsters.push(new Monster(i,j));

        counter++;
      }
    }

    console.log("total " + this.monsters.length);
  } //

  show() {
    scale(this.size / this.scale);
    this.displayMapPortion(this.player.pos.i, this.player.pos.j);
  }

  update() {
    this.monsterUpdate();
    this.count();
  }

  count() {
    let treasure_count = 0;

    for (let i = 0; i < this.mapSize; i++) {
      for (let j = 0; j < this.mapSize; j++) {
        if (this.map[i][j] == 4) {
          treasure_count++;
        }
      }
    }

    if (treasure_count == 0)
      alert(`GAME OVER!\nYour total score is ${Player.point * this.percent}`);

    this.treasure_div.innerHTML = "TREASURES LEFT: " + treasure_count;
    this.total_div.innerHTML = "CURRENT SCORE: " + (Player.point * this.percent) + " / 100";
  }

  monsterUpdate() {
    for (let i = 0; i < this.monsters.length; i++) {
      let { pre, post } = this.monsters[i].update();

      if (this.checkIfClear(post)) { //if path is crossable
        this.clearTrails(pre, post); //change color of cells/update this.map

        this.monsters[i].pos.i = post.i;
        this.monsters[i].pos.j = post.j;
      } else { //revert their position back to prev.
        this.monsters[i].pos.i = pre.i;
        this.monsters[i].pos.j = pre.j;
      }
    }
  }

  checkIfClear(post) { //check if the new coordinate is OK to cross
    let code = this.map[post.i][post.j];

    if (code != 0) {
      if (code == 3) {
        alert(`GAME OVER!\nYour total score is ${Player.point * this.percent}`);
        console.log("GAME OVER!");
        noLoop();
      } else if (code == 4) {
        this.treasureCount--;
      }
      return true;
    }
    return false;
  }

  clearTrails(pre, post) { //change cell color of the prev and post
    let preCode = this.map[pre.i][pre.j];
    let postCode = this.map[post.i][post.j];

    if (preCode == 2 || preCode == 3) { //Player

    } else if (preCode == 4) { //Treasure

    } else if (preCode == 5 || preCode == 6 || preCode == 7) {
      if ( (preCode != 1 && preCode != 5) || (postCode != 1 && postCode != 5) ) {
        //console.log(preCode, postCode);
        //console.log(`PRE: pre- ${this.map[pre.i][pre.j]} post- ${this.map[post.i][post.j]}`);
      }
      if (preCode == 5) { //Monster on OS
        this.map[pre.i][pre.j] = 1;
      } else if (preCode == 6) { //Monster on TREASURE
        this.map[pre.i][pre.j] = 4;
      } else if (preCode == 7) { //Monster on PLAYER (OS)
        this.map[pre.i][pre.j] = 3;
      } else {
        this.map[pre.i][pre.j] = 1;
      }

      if (postCode == 1) { //Stepped on OS?
        this.map[post.i][post.j] = 5;
      } else if (postCode == 4) { //Stepped on TREASURE?
        this.map[post.i][post.j] = 6;
      } else if (postCode == 3) {//Stepped on PLAYER (OS)?
        this.map[post.i][post.j] = 7;
      } else {
        this.map[post.i][post.j] = 5;
      }

      if ( (preCode != 1 && preCode != 5) || (postCode != 1 && postCode != 5) ) {
        //console.log(`POST: pre- ${this.map[pre.i][pre.j]} post- ${this.map[post.i][post.j]}`);
      }


    }
  }

  checkIfStillAlive(cell) {
    /*
    If a living cell has less than two living neighbours, it dies.
    If a living cell has two or three living neighbours, it stays alive.
    If a living cell has more than three living neighbours, it dies.
    If a dead cell has exactly three living neighbours, it becomes alive.
    */

    let alive = cell.alive;
    let num = cell.count;

    if (alive) {
      if (num < 2)
        return false;
      else if (num == 2 || num == 3)
        return true;
      else
        return false;
    } else {
      if (num == 3)
        return true;
      else {
        return false;
      }
    }
  }

  countSurvivors(arr, i, j) {
    let count = 0;
    let directionArr = [];

    if (i == 0) {
      if (j <= 0) {
        //E, SE, S
        directionArr.push("E");
        directionArr.push("SE");
        directionArr.push("S");

      } else if (j >= this.mapSize - 1) {
        //W, SW, S
        directionArr.push("W");
        directionArr.push("SW");
        directionArr.push("S");

      } else {
        // W, E, SW, SE, S
        directionArr.push("W");
        directionArr.push("E");
        directionArr.push("SW");
        directionArr.push("SE");
        directionArr.push("S");
      }
    } else if (i >= this.mapSize - 1) {
      if (j <= 0) {
        //N, NE, E
        directionArr.push("N");
        directionArr.push("NE");
        directionArr.push("E");
      } else if (j >= this.mapSize - 1) {
        //N, NW, W
        directionArr.push("N");
        directionArr.push("NW");
        directionArr.push("W");
      } else {
        // W, E, NW, NE, N
        directionArr.push("W");
        directionArr.push("E");
        directionArr.push("NW");
        directionArr.push("NE");
        directionArr.push("N");
      }
    } else {
      // ALL
      directionArr.push("NW");
      directionArr.push("N");
      directionArr.push("NE");
      directionArr.push("W");
      directionArr.push("E");
      directionArr.push("SW");
      directionArr.push("S");
      directionArr.push("SE");
    }

    // [NW, N, NE, W, NULL, E, SW, S, SE]
    // [ 0, 1,  2, 3,    4, 5,  6, 7,  8]

    directionArr = directionArr.map((dir) => {
      switch(dir) {
        case "NW":
          return 0;
        case "N":
          return 1;
        case "NE":
          return 2;
        case "W":
          return 3;
        case "E":
          return 5;
        case "SW":
          return 6;
        case "S":
          return 7;
        case "SE":
          return 8;
      }
    });

    for (let k = 0; k < directionArr.length; k++) {
      let res = arr[floor(i + (directionArr[k] / 3) - 1)][floor(j + (directionArr[k] % 3) - 1)];
      count += res ? 1 : 0;
    }

    return {count: count,
            alive: arr[i][j]
           };
  }

  displayMapPortion(charI, charJ) {
          //0 : SEA (UNCROSSABLE) - WHITE
          //1 : OPEN SPACE (OS)   - BLACK
          //2 : PLAYER (SEA)      - BLUE
          //3 : PLAYER (OS)       - GREEN
          //4 : TREASURE (OS)     - PURPLE
          //5 : MONSTER (OS)      - ORANGE
          //6 : MONSTER & TRSR    - ORANGE
          //7 : MONSTER & PLAYER  - ORANGE
          // OUTLINE = RED
    let pixel = 0;

    noStroke();
    for (let i = charI - 5; i < charI + 5; i++) {
      for (let j = charJ - 5; j < charJ + 5; j++) {
        let curr;
        try{
          curr = this.map[i][j];

          if (curr == 0) //SEA
            fill(255, 255, 255);
          else if (curr == 1) //OS
            fill(0, 0, 0);
          else if (curr == 2) //PLAYER SEA
            fill(0, 0, 255);
          else if (curr == 3) //PLAYER OS
            fill(0, 255, 0);
          else if (curr == 4) //TREASURE
            fill(173, 153, 255);
          else if (curr == 5 || curr == 6 || curr == 7) { //MONSTER
            fill(200, 0, 0);
          }
          else //BARRIER
            fill(255, 0, 0);
        } catch (e) {
          fill(255, 0, 0);
        }

        rect(floor(pixel % 10) * 5, floor(pixel / 10) * 5, 5, 5);
        pixel++;
      }
    }

    this.displayMap();
  }

  displayMap() {
    noStroke();
    scale(2 * this.scale / this.size);

    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map.length; j++) {
        let curr = this.map[i][j];

          if (curr == 0) {
            fill(255, 255, 255);
          }
          else if (curr == 1) {
            fill(0, 0, 0);
          }
          else if (curr == 2) {
            fill(0, 0, 255);
          }
          else if (curr == 3) {
            fill(0, 255, 0);
          }
          else if (curr == 4) {
            //fill(173, 153, 255);
          } else if (curr == 5 || curr == 6 || curr == 7) { //MONSTER
            fill(230, 165, 0);
          }

          rect(j, i, 1, 1);
      }
    }
  }
}
