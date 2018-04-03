/* global Phaser */
'use strict';

import {level, TILE_DESC} from './level.js';
import LevelManager from './LevelManager.js';
import Solver from './Solver.js';

var Game;
export default Game;

const gameOptions = {
  tileSize: 40, // physicaly 40x40 px
  gameWidth: 520,
  gameHeight: 520,
  gameSpeed: 100, // TODO: remove speed
  gameScale: 2 // TODO: define scale factor
};

const DIRECTIONS = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3
};

window.onload = () => {
  const gameConfig = {
    type: Phaser.AUTO,
    width: gameOptions.gameWidth,
    height: gameOptions.gameHeight,
    scene: [playGame]
  };
  Game = new Phaser.Game(gameConfig);
  resize();
  // window.addEventListener("resize", resize, false);
};

class playGame extends Phaser.Scene {
  constructor () {
    super({key: 'PlayGame'});
    this.INPUT_DELAY = 200;
    this.lastKeyTime = 0;
  }

  preload () {
    this.load.spritesheet('tiles', '../images/tiles.png', {
      frameWidth: gameOptions.tileSize,
      frameHeight: gameOptions.tileSize
    });
  }

  create () {
    this.cameras.main.x = gameOptions.tileSize;
    this.cameras.main.y = gameOptions.tileSize;

    this.levelManager = new LevelManager(level, gameOptions.tileSize);

    for (let key in TILE_DESC) {
      let tab = [];
      switch (TILE_DESC[key]) {
        case TILE_DESC.WALL:
          let walls = this.levelManager.getObjByKey(TILE_DESC.WALL);
          walls.forEach((ele) => {
            tab.push(this.add.sprite(ele.x, ele.y, 'tiles', 1));
          });
          break;
        case TILE_DESC.EMPTY:
          let empty = this.levelManager.getObjByKey(TILE_DESC.EMPTY);
          empty = empty.concat(this.levelManager.getObjByKey(TILE_DESC.PLAYER));
          empty = empty.concat(this.levelManager.getObjByKey(TILE_DESC.BOX));
          empty.forEach((ele) => {
            tab.push(this.add.sprite(ele.x, ele.y, 'tiles', 0));
          });
          break;
        case TILE_DESC.BOX:
          let boxes = this.levelManager.getObjByKey(TILE_DESC.BOX);
          boxes.forEach((ele) => {
            tab.push(this.add.sprite(ele.x, ele.y, 'tiles', 3));
          });
          break;
        case TILE_DESC.PLAYER:
          let players = this.levelManager.getObjByKey(TILE_DESC.PLAYER);
          players.forEach((ele) => {
            tab.push(this.add.sprite(ele.x, ele.y, 'tiles', 4));
          });
          this.player = tab[0];
          break;
        case TILE_DESC.GOAL:
          let goals = this.levelManager.getObjByKey(TILE_DESC.GOAL);
          goals.forEach((ele) => {
            tab.push(this.add.sprite(ele.x, ele.y, 'tiles', 2));
          });
          break;
        default:
      }
      tab.forEach((ele) => {
        ele.setOrigin(0);
        ele.type = TILE_DESC[key];
      });
      this.levelManager.put(TILE_DESC[key], tab);
    }

    this.keys = {
      W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      R: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
    };

    this.solver = new Solver(this.levelManager, this.player); // TODO: rework that constructor and class
    this.solver.brainlessBruteForce();
  }

  update () {
    if (this.lastKeyTime + this.INPUT_DELAY < this.time.now) {
      this.lastKeyTime = (this.checkKeys())
        ? this.time.now
        : this.lastKeyTime;
    }
  }

  checkKeys () {
    if (this.keys.W.isDown) {
      if (this.levelManager.checkMove(this.player, DIRECTIONS.UP) > -1) {
        this.levelManager.move(this.player, DIRECTIONS.UP);
      }
    } else if (this.keys.S.isDown) {
      if (this.levelManager.checkMove(this.player, DIRECTIONS.DOWN) > -1) {
        this.levelManager.move(this.player, DIRECTIONS.DOWN);
      }
    } else if (this.keys.A.isDown) {
      if (this.levelManager.checkMove(this.player, DIRECTIONS.LEFT) > -1) {
        this.levelManager.move(this.player, DIRECTIONS.LEFT);
      }
    } else if (this.keys.D.isDown) {
      if (this.levelManager.checkMove(this.player, DIRECTIONS.RIGHT) > -1) {
        this.levelManager.move(this.player, DIRECTIONS.RIGHT);
      }
    } else if (this.keys.R.isDown) {
      this.levelManager.resetPositions();
    } else {
      return 0;
    }
    return 1;
  }
}

function resize () {
  const canvas = document.querySelector('canvas');
  canvas.style.width = Game.config.width;
  canvas.style.height = Game.config.height;
  // var windowWidth = window.innerWidth;
  // var windowHeight = window.innerHeight;
  // var windowRatio = windowWidth / windowHeight;
  // var gameRatio = game.config.width / game.config.height;
  // console.log(gameRatio + ' ' + windowRatio);
  // if (windowRatio < gameRatio) {
  // canvas.style.width = windowWidth + "px";
  //   canvas.style.height = (windowWidth / gameRatio) + "px";
  // }
  // else {
  //   canvas.style.width = (windowHeight * gameRatio) + "px";
  // canvas.style.height = windowHeight + "px";
  // }
}
