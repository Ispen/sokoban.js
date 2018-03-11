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

  getIndexByPos (x, y) {
    const tabISize = this.objects.length;
    for (let i = 0; i < tabISize; i++) {
      const tabJSize = this.objects[i].length;
      for (let j = 0; j < tabJSize; j++) {
        if (this.objects[i][j].x === x && this.objects[i][j].y === y) {
          return {desc: i, index: j};
        }
      }
    }
    return -1;
  }

  swap (obj1, obj2) {
    const tmp = this.objects[obj1.x][obj1.y];
    this.objects[obj1.x][obj1.y] = this.objects[obj2.x][obj2.y];
    this.objects[obj2.x][obj2.y] = tmp;
  }

  getPos (key) {
    return this.objects[key];
  }

  put (key, tab) {
    this.objects[key] = tab;
  }

}
