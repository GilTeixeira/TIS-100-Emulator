import { NodeFactory } from './node_factory'
import { BasicExecutionNode, Source, Sink } from './node'
import { level } from './level'

export class Tis100 {
  private level: level
  private nodeGrid: BasicExecutionNode[][]
  private sources: Source[]
  private sinks: Sink[]

  constructor(level: level) {
    this.level = level
    let nodeFactory = new NodeFactory(level.x, level.y, level.sources, level.sinks)
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

  getSources(): Source[] {
    return this.sources
  }

  getSinks(): Sink[] {
    return this.sinks
  }

  getLevel(): level {
    return this.level
  }
}
