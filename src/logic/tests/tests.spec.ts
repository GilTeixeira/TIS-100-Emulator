import { expect } from "chai"

import { NodeFactory } from "../node_factory"
import { Directions, Status } from "../macros"
import {
  NopCommand,
  SwpCommand,
  SavCommand,
  NegCommand,
  SubCommand,
  AddCommand,
  MovCommand,
  JmpCommand,
  JezCommand,
  JnzCommand,
  JgzCommand,
  JlzCommand,
  JroCommand
} from "../commands"
import { ArgumentDir, ArgumentValue, ArgumentACC } from "../command_args"

import "mocha"
import { BasicExecutionNode } from "../node"
import { Tis100 } from "../tis_100"

describe("Test NodeFactory", () => {
  let nodeFac = new NodeFactory(2, 2, [], [])
  let grid = nodeFac.getNodeGrid()

  it("Test Ports", () => {
    grid[0][0].pushNumber(Directions.RIGHT, 5)
    expect(grid[0][1].readNumber(Directions.LEFT)).to.equal(5)
    expect(grid[0][1].readNumber(Directions.LEFT)).to.equal(null)

    grid[0][0].pushNumber(Directions.RIGHT, 10)
    expect(grid[0][1].readNumber(Directions.LEFT)).to.equal(10)

    grid[0][1].pushNumber(Directions.LEFT, 15)
    expect(grid[0][0].readNumber(Directions.RIGHT)).to.equal(15)
  })

  it("Test Commands", () => {
    let nodeTopLeft = grid[0][0]
    let nodeTopRight = grid[0][1]

    let cmd = new MovCommand(
      nodeTopLeft,
      ["testCommands"],
      new ArgumentValue(6),
      new ArgumentDir(nodeTopLeft, Directions.RIGHT),
      1
    )

    expect(nodeTopLeft.getState()).to.equal(Status.IDLE)
    cmd.execute()
    expect(nodeTopLeft.getState()).to.equal(Status.WRTE)

    cmd = new MovCommand(
      nodeTopRight,
      ["testCommands"],
      new ArgumentDir(nodeTopRight, Directions.LEFT),
      new ArgumentACC(nodeTopRight),
      2
    )

    cmd.execute()
    expect(nodeTopLeft.getState()).to.equal(Status.WRTE) // why??

    expect(nodeTopRight.getState()).to.equal(Status.RUN)
    expect(nodeTopRight.getACC()).to.equal(6)
  })

  it("Test Command Parser", () => {
    let program =
      "nop           \n\
      label1:        \n\
      label2: swp    \n\
      sav            \n\
      neg            \n\
      sub 5          \n\
      add acc        \n\
      mov 5 right  \n\
      jmp label1     \n\
      jez label1     \n\
      jnz label1     \n\
      jgz label1     \n\
      jlz label1     \n\
      jro label1     "
    let nodeTopLeft = grid[0][0]
    let nodeTopRight = grid[0][1]
    nodeTopLeft.resetNode()
    nodeTopRight.resetNode()

    nodeTopLeft.setInstructions(program)
    let commands = nodeTopLeft.getCommands()

    expect(commands[0] instanceof NopCommand).to.be.true
    expect(commands[1] instanceof SwpCommand).to.be.true
    expect(commands[2] instanceof SavCommand).to.be.true
    expect(commands[3] instanceof NegCommand).to.be.true
    expect(commands[4] instanceof SubCommand).to.be.true
    expect(commands[5] instanceof AddCommand).to.be.true
    expect(commands[6] instanceof MovCommand).to.be.true
    expect(commands[7] instanceof JmpCommand).to.be.true
    expect(commands[8] instanceof JezCommand).to.be.true
    expect(commands[9] instanceof JnzCommand).to.be.true
    expect(commands[10] instanceof JgzCommand).to.be.true
    expect(commands[11] instanceof JlzCommand).to.be.true
    expect(commands[12] instanceof JroCommand).to.be.true
    commands[6].execute()
    expect(nodeTopRight.readNumber(Directions.LEFT)).to.equal(5)
  })

  it("Test Sink and Sources", () => {
    let tis100 = new Tis100(1, 1, [0], [0])
    let nodeGrid = tis100.getGrid()
    let node = nodeGrid[0][0]
    let sinks = tis100.getSinks()
    let sources = tis100.getSources()

    sources[0].setInputs([1, 2, 3, 4])

    node.setInstructions("mov Up Down")

    tis100.step()

    expect(sources[0].getInputs()).to.eql([2, 3, 4])
    expect(sinks[0].getOutputs()).to.eql([1])

    tis100.step()
    tis100.step()
    tis100.step()
    tis100.step()
    tis100.step()
    tis100.step()

    expect(sources[0].getInputs()).to.eql([])
    expect(sinks[0].getOutputs()).to.eql([1, 2, 3, 4])
  })
})
