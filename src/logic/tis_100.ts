import { NodeFactory } from "./node_factory"
import { BasicExecutionNode, Source, Sink } from "./node"

export class Tis100 {
  private nodeGrid: BasicExecutionNode[][]
  private sources: Source[]
  private sinks: Sink[]

  constructor(x: number, y: number, sourcesPos: number[], sinksPos: number[]) {
    let nodeFactory = new NodeFactory(x, y, sourcesPos, sinksPos)
    this.nodeGrid = nodeFactory.getNodeGrid()
    this.sinks = nodeFactory.getSinks()
    this.sources = nodeFactory.getSources()
  }

  run() {}

  step() {
    this.sources.forEach(source => {
      source.execute()
    })

    this.nodeGrid.forEach(nodeRow => {
      nodeRow.forEach(node => {
        node.executeRead()
      })
    })

    this.nodeGrid.forEach(nodeRow => {
      nodeRow.forEach(node => {
        node.executeWrite()
      })
    })

    this.sinks.forEach(sink => {
      sink.execute()
    })
  }

  getGrid(): BasicExecutionNode[][] {
    return this.nodeGrid
  }

  public getSources(): Source[] {
    return this.sources
  }

  public getSinks(): Sink[] {
    return this.sinks
  }
}
