import { BasicExecutionNode } from "./node";
import { Port } from "./port";
import { Directions } from "./macros";

export abstract class NodeFactory {
  static getNodeGrid(x: number, y: number): BasicExecutionNode[][] {
    let nodeGrid: BasicExecutionNode[][] = [];

    for (let i = 0; i < y; i++) {
      nodeGrid[i] = [];
      for (let j = 0; j < x; j++) {
        nodeGrid[i][j] = new BasicExecutionNode(null);
      }
    }

    for (let i = 0; i < y; i++) {
      for (let j = 0; j < x; j++) {
        this.initDstPorts(nodeGrid, j, i, x, y);
      }
    }

    return nodeGrid;
  }

  private static initDstPorts(
    nodeGrid: BasicExecutionNode[][],
    posX: number,
    posY: number,
    sizeX: number,
    sizeY: number
  ) {
    if (posY - 1 >= 0) {
      let upPort = new Port();
      nodeGrid[posY][posX].setDstPort(Directions.UP, upPort);
      nodeGrid[posY - 1][posX].setSrcPort(Directions.DOWN, upPort);
    }
    if (posY + 1 < sizeY) {
      let downPort = new Port();
      nodeGrid[posY][posX].setDstPort(Directions.DOWN, downPort);
      nodeGrid[posY + 1][posX].setSrcPort(Directions.UP, downPort);
    }
    if (posX - 1 >= 0) {
      let leftPort = new Port();
      nodeGrid[posY][posX].setDstPort(Directions.LEFT, leftPort);
      nodeGrid[posY][posX - 1].setSrcPort(Directions.RIGHT, leftPort);
    }
    if (posX + 1 < sizeX) {
      let rightPort = new Port();
      nodeGrid[posY][posX].setDstPort(Directions.RIGHT, rightPort);
      nodeGrid[posY][posX + 1].setSrcPort(Directions.LEFT, rightPort);
    }
  }
}
