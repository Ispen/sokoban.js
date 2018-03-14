//JavaScript-C24.2.0 (SpiderMonkey)

class Node {
  constructor () {
    this.up = undefined;
    this.down = undefined;
    this.left = undefined;
    this.right = undefined;
    this.flag = false;
    this.flagUp = true;
    this.flagDown = true;
    this.flagLeft = true;
    this.flagRight = true;
  }
}

import {TILE_DESC} from "./level.js";
var count = 0;
export default class SolverBySurist {
  constructor (levelManager, player) {
    this.levelManager = levelManager;
    this.player = player;
    this.goals = this.levelManager.getObjByKey(TILE_DESC.GOAL);
    this.boxes = this.levelManager.getObjByKey(TILE_DESC.BOX);
    createBranches = createBranches.bind(this);
    checkbranches = checkbranches.bind(this);
    checkWin = checkWin.bind(this);
  }
  exe () {
    var head = new Node();
    head = createBranches(head);
    while (checkWin() || count < 10) {
      this.levelManager.mapReset();
      checkbranches(head);
      console.log('count: ', count + '\n');
      count++;
    }
  }
}

const DIRS = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3
};

function createBranches(node) {
  if (this.levelManager.checkMove(this.player, DIRS.UP) > -1) {
    node.up = new Node();
  }
  if (this.levelManager.checkMove(this.player, DIRS.DOWN) > -1) {
    node.down = new Node();
  }
  if (this.levelManager.checkMove(this.player, DIRS.RIGHT) > -1) {
    node.right = new Node();
  }
  if (this.levelManager.checkMove(this.player, DIRS.LEFT) > -1) {
    node.left = new Node();
  }
  node.flag = true;
  return node;
}

function checkbranches(node){
  if(node.flag == false){
    createBranches(node);
    return false;
  }
  else{
    if(node.up && node.flagUp) {
      node.flagUp = false;
      this.levelManager.move(this.player, DIRS.UP)
      if(!checkbranches(node.up)){return false;}

    }
    if(node.down && node.flagDown) {
      node.flagDown = false;
      this.levelManager.move(this.player, DIRS.DOWN)
      if(!checkbranches(node.down)){return false;}

    }
    if(node.left && node.flagLeft) {
      node.flagLeft = false;
      this.levelManager.move(this.player, DIRS.LEFT)
      if(!checkbranches(node.left)){return false;}

    }
    if(node.right && node.flagRight) {
      node.flagRight = false;
      this.levelManager.move(this.player, DIRS.RIGHT)
      if(!checkbranches(node.right)){return false;}
    }
    node.flagUp = true;
    node.flagDown = true;
    node.flagLeft = true;
    node.flagRight = true;
  }
}

function checkWin () {
  let count = 0;
  this.goals.forEach((goal) => {
    this.boxes.forEach((box) => {
      if (goal.x === box.x && goal.y === box.y) {
        count++;
      }
    });
  });
  return count === this.goals.length;
}
