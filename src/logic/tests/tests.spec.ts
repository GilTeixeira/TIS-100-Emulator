import { expect } from 'chai';

import { NodeFactory } from "../node_factory";
import { Directions, Status } from "../macros";
import {
  NopCommand, SwpCommand,
  SavCommand, NegCommand, SubCommand,
  AddCommand, MovCommand, JmpCommand,
  JezCommand, JnzCommand, JgzCommand,
  JlzCommand, JroCommand
} from "../commands";
import { ArgumentDir, ArgumentValue, ArgumentACC } from "../command_args";

import 'mocha';
import { BasicExecutionNode } from '../node';

describe('Test NodeFactory', () => {

  let grid = NodeFactory.getNodeGrid(2, 2);

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

  it('Test Command Parser', () => {
    let program =
      "nop           \n\
      label1:        \n\
      label2: swp    \n\
      sav            \n\
      neg            \n\
      sub 5          \n\
      add acc        \n\
      mov acc right  \n\
      jmp label1     \n\
      jez label1     \n\
      jnz label1     \n\
      jgz label1     \n\
      jlz label1     \n\
      jro label1     "
    let node = new BasicExecutionNode(program);

    let commands = node.getCommands()

    expect(commands[0] instanceof NopCommand).to.be.true;
    expect(commands[1] instanceof SwpCommand).to.be.true;
    expect(commands[2] instanceof SavCommand).to.be.true;
    expect(commands[3] instanceof NegCommand).to.be.true;
    expect(commands[4] instanceof SubCommand).to.be.true;
    expect(commands[5] instanceof AddCommand).to.be.true;
    expect(commands[6] instanceof MovCommand).to.be.true;
    expect(commands[7] instanceof JmpCommand).to.be.true;
    expect(commands[8] instanceof JezCommand).to.be.true;
    expect(commands[9] instanceof JnzCommand).to.be.true;
    expect(commands[10] instanceof JgzCommand).to.be.true;
    expect(commands[11] instanceof JlzCommand).to.be.true;
    expect(commands[12] instanceof JroCommand).to.be.true;
  });

});

