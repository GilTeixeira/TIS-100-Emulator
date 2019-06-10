import { expect } from 'chai';

import { NodeFactory } from "../node_factory";
import { Directions, Status } from "../macros";
import { MovCommand } from "../commands";
import { ArgumentDir, ArgumentValue, ArgumentACC } from "../command_args";

import 'mocha';

describe('Test NodeFactory', () => {

  let grid = NodeFactory.getNodeGrid(2, 2);
  const newline = "\n";

  it('Test Ports', () => {
    grid[0][0].pushNumber(Directions.RIGHT, 5);
    expect(grid[0][1].readNumber(Directions.LEFT)).to.equal(5);
    expect(grid[0][1].readNumber(Directions.LEFT)).to.equal(null);

    grid[0][0].pushNumber(Directions.RIGHT, 10);
    expect(grid[0][1].readNumber(Directions.LEFT)).to.equal(10);


    grid[0][1].pushNumber(Directions.LEFT, 15);
    expect(grid[0][0].readNumber(Directions.RIGHT)).to.equal(15);


  });

  it('Test Commands', () => {
    let nodeTopLeft = grid[0][0];
    let nodeTopRight = grid[0][1];
    let cmd = new MovCommand(
      nodeTopLeft,
      ["testCommands"],
      new ArgumentValue(3),
      new ArgumentDir(nodeTopLeft, Directions.RIGHT),
      0
    );
    cmd.execute();
    expect(nodeTopLeft.getState()).to.equal(Status.RUN);
    expect(nodeTopRight.readNumber(Directions.LEFT)).to.equal(3);

    cmd = new MovCommand(
      nodeTopLeft,
      ["testCommands"],
      new ArgumentValue(6),
      new ArgumentDir(nodeTopLeft, Directions.RIGHT),
      1
    );
    cmd.execute();
    cmd = new MovCommand(
      nodeTopRight,
      ["testCommands"],
      new ArgumentDir(nodeTopRight, Directions.LEFT),
      new ArgumentACC(nodeTopRight),
      2
    );
    cmd.execute();

    expect(nodeTopRight.getState()).to.equal(Status.RUN);
    expect(nodeTopRight.getACC()).to.equal(6);

  });


});

