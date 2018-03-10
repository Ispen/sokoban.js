'use strict';

export default class LevelManager {
  constructor (level, desc, size) { // reminder: {EMPTY, WALL, BOX, SPAWN, GOAL}
    this.originLevel = level.slice();
    this.level = level;
    this.desc = desc;
    this.size = size;
    this.levelWidth = this.level.length;
    this.levelHeight = this.level[0].length;
    this.positions = [];
    for (let key in desc) {
      // create tables with {x, y} cords of all elements
      this.positions[desc[key]] = this.generatePos(desc[key]);
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

  getPos (key) {
    return this.positions[key];
  }

}
