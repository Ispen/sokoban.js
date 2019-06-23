/* global Phaser */
'use strict';

import {
  level,
  TILE_DESC
} from './level.js';
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
  constructor() {
    super({
      key: 'PlayGame'
    });
    this.INPUT_DELAY = 200;
    this.lastKeyTime = 0;
    this.checkKeys = this.checkKeys.bind(this);
    this.keys = { };
    this.levelManager = new LevelManager(level, gameOptions.tileSize);
    this.player = {};
  }

  preload() {
    this.load.spritesheet('tiles', '../images/tiles.png', {
      frameWidth: gameOptions.tileSize,
      frameHeight: gameOptions.tileSize
    });
  }

  create() {
    this.cameras.main.x = gameOptions.tileSize;
    this.cameras.main.y = gameOptions.tileSize;

    this.keys = {
      W: Object.assign(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W), {
        action: this.goUp
      }),
      A: Object.assign(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A), {
        action: this.goLeft
      }),
      S: Object.assign(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S), {
        action: this.goDown
      }),
      D: Object.assign(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D), {
        action: this.goRight
      }),
      R: Object.assign(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R), {
        action: this.resetMap
      }),
    };

    this.player = this.levelManager.loadLevel({
      scene: this
    });
    this.solver = new Solver(this.levelManager, this.player); // TODO: rework that constructor and class
    this.solver.brainlessBruteForce();
  }

  update() {
    if (this.lastKeyTime + this.INPUT_DELAY < this.time.now) {
      this.lastKeyTime = (this.checkKeys()) ?
        this.time.now :
        this.lastKeyTime;
    }
  }

  goUp(levelManager, player) {
    if (levelManager.checkMove(player, DIRECTIONS.UP) > -1) {
      levelManager.move(player, DIRECTIONS.UP);
      return false;
    }
    return true; // move not possible
  }

  goDown(levelManager, player) {
    if (levelManager.checkMove(player, DIRECTIONS.DOWN) > -1) {
      levelManager.move(player, DIRECTIONS.DOWN);
      return false;
    }
    return true; // move not possible
  }

  goLeft(levelManager, player) {
    if (levelManager.checkMove(player, DIRECTIONS.LEFT) > -1) {
      levelManager.move(player, DIRECTIONS.LEFT);
      return false;
    }
    return true; // move not possible
  }

  goRight(levelManager, player) {
    if (levelManager.checkMove(player, DIRECTIONS.RIGHT) > -1) {
      levelManager.move(player, DIRECTIONS.RIGHT);
      return false;
    }
    return true; // move not possible
  }

  resetMap(levelManager) {
    levelManager.resetPositions();
  }

  checkKeys() {
    const results = Object.keys(this.keys).map(key => { // TODO: disable 2 move action in one frame (like A+W)
      if(this.keys[key].isDown) {
        this.keys[key].action(this.levelManager, this.player);
        return true;
      }
    });
    return results.length ? true : false;
  }

}

function resize() {
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
