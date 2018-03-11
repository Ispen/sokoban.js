/* global Phaser */
'use strict';

import {level, TILE_DESC} from './level.js';
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
    this.cameras.main.x = gameOptions.tileSize;
    this.cameras.main.y = gameOptions.tileSize;

    this.levelManager = new LevelManager(level, TILE_DESC, gameOptions.tileSize);

    for (let key in TILE_DESC) {
      let tab = [];
      switch (TILE_DESC[key]) {
        case TILE_DESC.WALL:
          let walls = this.levelManager.getPos(TILE_DESC.WALL);
          walls.forEach((ele) => {
            tab.push(this.add.sprite(ele.x, ele.y, 'tiles', 1));
          });
          break;
        case TILE_DESC.EMPTY:
          let empty = this.levelManager.getPos(TILE_DESC.EMPTY);
          empty = empty.concat(this.levelManager.getPos(TILE_DESC.PLAYER));
          empty = empty.concat(this.levelManager.getPos(TILE_DESC.BOX));
          empty.forEach((ele) => {
            tab.push(this.add.sprite(ele.x, ele.y, 'tiles', 0));
          });
          break;
        case TILE_DESC.BOX:
          let boxes = this.levelManager.getPos(TILE_DESC.BOX);
          boxes.forEach((ele) => {
            tab.push(this.add.sprite(ele.x, ele.y, 'tiles', 3));
          });
          break;
        case TILE_DESC.PLAYER:
          let players = this.levelManager.getPos(TILE_DESC.PLAYER);
          players.forEach((ele) => {
            tab.push(this.add.sprite(ele.x, ele.y, 'tiles', 4));
          });
          this.player = tab[0];
          break;
        case TILE_DESC.GOAL:
          let goals = this.levelManager.getPos(TILE_DESC.GOAL);
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
      D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };

    // this.player.checkMove = checkMove.bind(this.player);
  }

  update () {
    if (this.keys.W.isDown) { checkMove(this.player, DIRECTIONS.UP); }
    if (this.keys.S.isDown) { checkMove(this.player, DIRECTIONS.DOWN); }
    if (this.keys.A.isDown) { checkMove(this.player, DIRECTIONS.LEFT); }
    if (this.keys.D.isDown) { checkMove(this.player, DIRECTIONS.RIGHT); }
  }
}

function checkMove (context, dir) {
  // first check direction
  // secondly get tile from that direction (if up, from up)
  // if empty - move, if box - do same for box, if other return error
  const targetPos = {x: context.x, y: context.y};
  const size = gameOptions.tileSize;
  const levelManager = context.scene.levelManager;

  switch (dir) {
    case DIRECTIONS.UP:
      targetPos.y -= size;
      break;
    case DIRECTIONS.DOWN:
      targetPos.y += size;
      break;
    case DIRECTIONS.LEFT:
      targetPos.x -= size;
      break;
    case DIRECTIONS.RIGHT:
      targetPos.x += size;
      break;
    default: console.warn('calling object to move, without direction!');
  }

  const t = levelManager.getIndexByPos(context.x, context.y, context.type).pop(); // there isn't possibility to 2 box or 2 players in one tile, so just pop
  const target = levelManager.getIndexByPos(targetPos.x, targetPos.y).pop(); // a bit hardcoded, but first element is EMPTY tile, so we want the last one witch will be BOX

  if (target !== -1 && target.desc === TILE_DESC.EMPTY) {
    context.x = targetPos.x;
    context.y = targetPos.y;
  } else if (t.desc !== TILE_DESC.BOX && target.desc === TILE_DESC.BOX) {
    if (checkMove(levelManager.getObj(target.desc, target.index), dir) > -1) {
      context.x = targetPos.x;
      context.y = targetPos.y;
    }
  } else {
    return -1;
  }
  return 0;
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
