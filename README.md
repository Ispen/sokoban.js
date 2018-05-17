# H1 Sokoban.js #
Sokoban.js is a playground for solvers of sokoban game. 
Just import your map, run solver and wait for results.
  
The currently working algorithm (brainless brute force) can find a solution for up to 17 steps (more can harm your web browser).  
If you want to get more performance, write yours!
You can also walk manually using WSAD keys and R for map reset.

### How do I get set up? ###
1. Download repo  
`git clone https://github.com/Ispen/sokoban.js`
2. Go into and run `npm install`  
`cd sokoban.js && npm install`
3. Run project and check http://localhost:3000/  
`npm start`
### Progress ###
Game engine - DONE   
View model - DONE  
Example map - DONE  
Moving and collisions - DONE  
Solver - DONE  
Implement Brute Force solve algorithm - DONE  
Move Solver to Web Workers - IN PROGRESS  
Implement more intelligent solve algorithm - TODO  
