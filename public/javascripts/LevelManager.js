'use strict';

export default class LevelManager {
  constructor (level, desc, size) { // reminder: {EMPTY, WALL, BOX, SPAWN, GOAL}
    this.originLevel = level.slice();
    this.level = level;
    this.desc = desc;
    this.size = size;
    this.levelWidth = this.level.length;
    this.levelHeight = this.level[0].length;
    this.objects = []; // 2-dimensional array, where each of them is a list of one of desc element - for ex. this.objects[BOX_ID] return table of all positions of boxes.
    for (let key in desc) {
      // create tables with {x, y} cords of all elements
      this.objects[desc[key]] = this.generatePos(desc[key]);
    }
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
          tab.push({desc: i, index: j});
        }
      }
    }
    if (tab.length === 0) {
      return -1;
    } else {
      return tab;
    }
  }

  getObj (i, j) {
    return this.objects[i][j];
  }

  getPos (key) {
    return this.objects[key];
  }

  put (key, tab) {
    this.objects[key] = tab;
  }
}
