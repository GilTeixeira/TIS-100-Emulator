import { NodeFactory } from "./node_factory";
import { BasicExecutionNode } from "./node";

export class Tis100 {
  private nodeGrid: BasicExecutionNode[][];

  constructor(private x: number, private y: number) {
    this.nodeGrid = NodeFactory.getNodeGrid(x, y);
  }

  run() {}

  step() {
    this.nodeGrid.forEach(nodeRow => {
      nodeRow.forEach(node => {
        node.executeRead();
      });
    });

    this.nodeGrid.forEach(nodeRow => {
      nodeRow.forEach(node => {
        node.executeWrite();
      });
    });
  }

  getGrid(): BasicExecutionNode[][] {
    return this.nodeGrid;
  }
}
