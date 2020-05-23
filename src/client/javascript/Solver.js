class Node {
  constructor(parent, dir) {
    this.pathToMe = parent ? parent.pathToMe.slice() : [];
    if (dir === 0 || dir) {
      this.pathToMe.push(dir);
    }
  }
}

export default class Solver {
  constructor(levelManager, player) {
    this.levelManager = levelManager;
    this.player = player;
  }

  brainlessBruteForce() {
    const STEPS_DIR = 4;
    const MAX_MOVES = 13;
    let currentDepth = 0;
    let floorSize = 0;
    const allNodes = [];
    for (let i = 0; i <= MAX_MOVES; i++) {
      allNodes[i] = [];
    }
    const head = new Node(undefined, undefined);
    allNodes[0] = [head];
    let node;

    while (currentDepth < MAX_MOVES) {
      floorSize = allNodes[currentDepth].length;
      for (let i = 0; i < floorSize; i++) {
        node = allNodes[currentDepth][i];
        for (let dir = 0; dir < STEPS_DIR; dir++) {
          this.levelManager.resetPositions();
          node.pathToMe.forEach(dir => {
            this.levelManager.move(this.player, dir);
          });
          if (this.levelManager.checkMove(this.player, dir) > -1) {
            this.levelManager.move(this.player, dir);
            allNodes[currentDepth + 1].push(new Node(node, dir));
            if (this.levelManager.isWin()) {
              console.log(
                'WIN! Winning path: ',
                allNodes[currentDepth + 1][
                  allNodes[currentDepth + 1].length - 1
                ]
              );
            }
          }
        }
      }
      currentDepth++;
    }
    console.log('The end! Reached depth: ', currentDepth);
  }
}
