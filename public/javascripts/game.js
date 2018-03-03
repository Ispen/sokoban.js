/* global Phaser */
'use strict';

import {level, tileDesc} from './level.js';
import LevelManager from './LevelManager.js';

var Game;
export default Game;
window.Game = Game; // game is fully global object

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
  }

  preload () {
    this.load.spritesheet('tiles', '../images/tiles.png', {
      frameWidth: gameOptions.tileSize,
      frameHeight: gameOptions.tileSize
    });
  }

  create () {
    this.levelManager = new LevelManager(level, tileDesc, gameOptions.tileSize);
    let playerPos = this.levelManager.getPos(tileDesc.SPAWN).pop();
    this.player = this.add.sprite(playerPos.x, playerPos.y, 'tiles', 4);

    this.statics = (function (t) {
      let all = [];
      let walls = t.levelManager.getPos(tileDesc.WALL);
      walls.forEach((ele) => {
        all.push(t.add.sprite(ele.x, ele.y, 'tiles', 1));
      });
      let empty = t.levelManager.getPos(tileDesc.EMPTY);
      empty = empty.concat(t.levelManager.getPos(tileDesc.SPAWN));
      empty = empty.concat(t.levelManager.getPos(tileDesc.BOX));
      empty.forEach((ele) => {
        all.push(t.add.sprite(ele.x, ele.y, 'tiles', 0));
      });
      return all;
    }(this));

    this.boxes = (function (t) {
      let boxes = [];
      t.levelManager.getPos(tileDesc.BOX).forEach((ele) => {
        boxes.push(t.add.sprite(ele.x, ele.y, 'tiles', 3));
      });
      return boxes;
    }(this));

    this.player.setOrigin(0);
    this.statics.forEach((ele) => {
      ele.setOrigin(0);
    });
    this.boxes.forEach((ele) => {
      ele.setOrigin(0);
    });

    this.keys = {
      W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };
  }

  update () {
    if (this.keys.W.isDown) { console.log('PRESSED W'); }
    if (this.keys.S.isDown) { console.log('PRESSED S'); }
    if (this.keys.A.isDown) { console.log('PRESSED A'); }
    if (this.keys.D.isDown) { console.log('PRESSED D'); }
  }

  checkMove (deltaX, deltaY) {
    if (this.isWalkable(this.player.posX + deltaX, this.player.posY + deltaY)) {
      this.movePlayer(deltaX, deltaY);
      return;
    }
    if (this.isCrate(this.player.posX + deltaX, this.player.posY + deltaY)) {
      if (this.isWalkable(this.player.posX + 2 * deltaX, this.player.posY + 2 * deltaY)) {
        this.moveCrate(deltaX, deltaY);
        this.movePlayer(deltaX, deltaY);
      }
    }
  }

  isWalkable (posX, posY) {
    return level[posY][posX] == EMPTY || level[posY][posX] == SPOT;
  }

  isCrate (posX, posY) {
    return level[posY][posX] == CRATE || level[posY][posX] == CRATE + SPOT;
  }

  movePlayer (deltaX, deltaY) {
    var playerTween = this.tweens.add({
      targets: this.player,
      x: this.player.x + deltaX * gameOptions.tileSize,
      y: this.player.y + deltaY * gameOptions.tileSize,
      duration: gameOptions.gameSpeed,
      onComplete: function (tween, target, player) {
        player.setFrame(level[player.posY][player.posX]);
      },
      onCompleteParams: [this.player]
    });
    level[this.player.posY][this.player.posX] -= PLAYER;
    this.player.posX += deltaX;
    this.player.posY += deltaY;
    level[this.player.posY][this.player.posX] += PLAYER;
  }

  moveCrate (deltaX, deltaY) {
    var crateTween = this.tweens.add({
      targets: this.crates[this.player.posY + deltaY][this.player.posX + deltaX],
      x: this.crates[this.player.posY + deltaY][this.player.posX + deltaX].x + deltaX * gameOptions.tileSize,
      y: this.crates[this.player.posY + deltaY][this.player.posX + deltaX].y + deltaY * gameOptions.tileSize,
      duration: gameOptions.gameSpeed,
      onComplete: function (tween, target, crate, player) {
        crate.setFrame(level[player.posY + deltaY][player.posX + deltaX]);
      },
      onCompleteParams: [this.crates[this.player.posY + deltaY][this.player.posX + deltaX], this.player]
    });
    this.crates[this.player.posY + 2 * deltaY][this.player.posX + 2 * deltaX] = this.crates[this.player.posY + deltaY][this.player.posX + deltaX];
    this.crates[this.player.posY + deltaY][this.player.posX + deltaX] = null;
    level[this.player.posY + deltaY][this.player.posX + deltaX] -= CRATE;
    level[this.player.posY + 2 * deltaY][this.player.posX + 2 * deltaX] += CRATE;
  }
}

function resize () {
  var canvas = document.querySelector('canvas');
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
