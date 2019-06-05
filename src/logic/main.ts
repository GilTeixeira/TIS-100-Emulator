import { NodeFactory } from "./node_factory";
import { Directions } from "./macros";
import { MovCommand } from "./commands";
import { ArgumentDir, ArgumentValue, ArgumentACC } from "./command_args";

let grid = NodeFactory.getNodeGrid(2, 2);
const newline = "\n";

// tests ports
grid[0][0].pushNumber(Directions.RIGHT, 10);
console.log(grid[0][1].readNumber(Directions.LEFT));
console.log(grid[0][1].readNumber(Directions.LEFT));
grid[0][0].pushNumber(Directions.RIGHT, 5);
console.log(grid[0][1].readNumber(Directions.LEFT));
grid[0][1].pushNumber(Directions.LEFT, 5);
console.log(grid[0][0].readNumber(Directions.RIGHT));
console.log(newline);

//test commands
let nodeTopLeft = grid[0][0];
let nodeTopRight = grid[0][1];
let cmd = new MovCommand(
  nodeTopLeft,
  "testCommands",
  new ArgumentValue(3),
  new ArgumentDir(nodeTopLeft, Directions.RIGHT)
);
cmd.execute();
console.log(nodeTopLeft.getState());
console.log(nodeTopRight.readNumber(Directions.LEFT));
console.log(newline);

cmd = new MovCommand(
  nodeTopLeft,
  "testCommands",
  new ArgumentValue(3),
  new ArgumentDir(nodeTopLeft, Directions.RIGHT)
);
cmd.execute();
cmd = new MovCommand(
  nodeTopRight,
  "testCommands",
  new ArgumentDir(nodeTopRight, Directions.LEFT),
  new ArgumentACC(nodeTopRight)
);
cmd.execute();
console.log(nodeTopRight.getState());
console.log(nodeTopRight.getACC());
console.log(newline);
