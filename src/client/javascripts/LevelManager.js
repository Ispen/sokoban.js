'use strict';

import {TILE_DESC} from './level.js';

const DIRECTIONS = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3
};

export default class LevelManager {
  constructor (level, size) { // reminder: {EMPTY, WALL, BOX, SPAWN, GOAL}
    this.level = level;
    this.size = size;
    this.levelWidth = this.level.length;
    this.levelHeight = this.level[0].length;
    this.objects = []; // 2-dimensional array, where each of them is a list of one of desc element - for ex. this.objects[BOX_ID] return table of all positions of boxes.
    for (let key in TILE_DESC) {
      // create tables with {x, y} cords of all elements
      this.objects[TILE_DESC[key]] = this.generatePos(TILE_DESC[key]);
    }
    this.startingPositions = savePositions(this.objects);
  }

  loadLevel({scene}) {
    let player;
    for (let key in TILE_DESC) {
      let tab = [];
      switch (TILE_DESC[key]) {
        case TILE_DESC.WALL:
          let walls = this.getObjByKey(TILE_DESC.WALL);
          walls.forEach((ele) => {
            tab.push(scene.add.sprite(ele.x, ele.y, 'tiles', 1));
          });
          break;
        case TILE_DESC.EMPTY:
          let empty = this.getObjByKey(TILE_DESC.EMPTY);
          empty = empty.concat(this.getObjByKey(TILE_DESC.PLAYER));
          empty = empty.concat(this.getObjByKey(TILE_DESC.BOX));
          empty.forEach((ele) => {
            tab.push(scene.add.sprite(ele.x, ele.y, 'tiles', 0));
          });
          break;
        case TILE_DESC.BOX:
          let boxes = this.getObjByKey(TILE_DESC.BOX);
          boxes.forEach((ele) => {
            tab.push(scene.add.sprite(ele.x, ele.y, 'tiles', 3));
          });
          break;
        case TILE_DESC.PLAYER:
          let players = this.getObjByKey(TILE_DESC.PLAYER);
          players.forEach((ele) => {
            tab.push(scene.add.sprite(ele.x, ele.y, 'tiles', 4));
          });
          player = tab[0];
          break;
        case TILE_DESC.GOAL:
          let goals = this.getObjByKey(TILE_DESC.GOAL);
          goals.forEach((ele) => {
            tab.push(scene.add.sprite(ele.x, ele.y, 'tiles', 2));
          });
          break;
        default:
      }
      tab.forEach((ele) => {
        ele.setOrigin(0);
        ele.type = TILE_DESC[key];
      });
      this.put(TILE_DESC[key], tab);
    }
    return player;
  }

  generatePos (key) {
    let tab = [];
    for (let i = 0; i < this.levelWidth; i++) {
      for (let j = 0; j < this.levelHeight; j++) {
        if (this.level[i][j] === key) {
          tab.push({y: i * this.size, x: j * this.size});
        }
      }
    }
    return tab;
  }

  getIndexByPos (x, y, type = -1) {
    const tab = [];
    const tabISize = (type > -1) ? type + 1 : this.objects.length;
    for (let i = (type > -1) ? type : 0; i < tabISize; i++) {
      const tabJSize = this.objects[i].length;
      for (let j = 0; j < tabJSize; j++) {
        if (this.objects[i][j].x === x && this.objects[i][j].y === y) {
          tab.push({x: i, y: j});
        }
      }
    }
    return tab;
  }

  getObjByIndex (i, j) {
    return this.objects[i][j];
  }

  getObjByKey (key) {
    return this.objects[key];
  }

  move (context, dir) {
    // logic should guarantee that way is clear - this function will force move
    const targetPos = this.newPositionVector(dir, context.x, context.y);
    const targetIndex = this.getIndexByPos(targetPos.x, targetPos.y, TILE_DESC.BOX).pop();
    if (targetIndex) {
      const target = this.getObjByIndex(targetIndex.x, targetIndex.y);
      this.move(target, dir);
    }
    context.x = targetPos.x;
    context.y = targetPos.y;
  }

  newPositionVector (dir, x = 0, y = 0) {
    let vector = {x: x, y: y};
    switch (dir) {
      case DIRECTIONS.UP:
        vector.y -= this.size;
        break;
      case DIRECTIONS.DOWN:
        vector.y += this.size;
        break;
      case DIRECTIONS.LEFT:
        vector.x -= this.size;
        break;
      case DIRECTIONS.RIGHT:
        vector.x += this.size;
        break;
      default: console.warn('calling object to move, without direction!');
    }
    return vector;
  }

  getSize () {
    return this.size;
  }

  put (key, tab) {
    this.objects[key] = tab;
  }

  checkMove (context, dir) {
    // verify if player or objects can move, if true, return direction
    const targetPos = this.newPositionVector(dir, context.x, context.y);

    const contextIndex = this.getIndexByPos(context.x, context.y, context.type).pop(); // there isn't possibility to 2 box or 2 players in one tile, so just pop
    const elementsOnTargetPos = this.getIndexByPos(targetPos.x, targetPos.y); // remember this return array, not obj!
    let targetIndex;
    if (elementsOnTargetPos.length <= 1) {
      targetIndex = elementsOnTargetPos.pop();
    } else {
      // in this stage only boxes matter, so pick them
      targetIndex = elementsOnTargetPos.filter((indexes) => {
        return indexes.x === TILE_DESC.BOX;
      }).pop();
    }

    // player can walk on EMPTY and GOAL fields, same BOX
    // 2 boxes can't be moved
    if (targetIndex && (targetIndex.x === TILE_DESC.EMPTY || targetIndex.x === TILE_DESC.GOAL)) {
      return dir;
    } else if (targetIndex && (contextIndex.x !== TILE_DESC.BOX && targetIndex.x === TILE_DESC.BOX)) {
      return this.checkMove(this.getObjByIndex(targetIndex.x, targetIndex.y), dir);
    } else {
      return -1;
    }
  }

  isWin () {
    // return true when all goal fields are occupied by boxes
    let count = 0;
    const goals = this.getObjByKey(TILE_DESC.GOAL);
    const boxes = this.getObjByKey(TILE_DESC.BOX);
    goals.forEach((goal) => {
      boxes.forEach((box) => {
        if (goal.x === box.x && goal.y === box.y) {
          count++;
        }
      });
    });
    return count === goals.length;
  }

  resetPositions () {
    const player = this.getObjByKey(TILE_DESC.PLAYER)[0];
    const boxes = this.getObjByKey(TILE_DESC.BOX);
    const newPlayerPos = this.startingPositions[TILE_DESC.PLAYER][0];
    const newBoxesPos = this.startingPositions[TILE_DESC.BOX];
    player.x = newPlayerPos.x;
    player.y = newPlayerPos.y;
    boxes.forEach((box, index) => {
      box.x = newBoxesPos[index].x;
      box.y = newBoxesPos[index].y;
    });
  }
}

const savePositions = (objects) => {
  const allPos = [];
  objects.forEach((tab, index) => {
    const pos = [];
    tab.forEach((ele) => {
      pos.push({x: ele.x, y: ele.y});
    });
    allPos[index] = pos;
  });
  return allPos;
};
