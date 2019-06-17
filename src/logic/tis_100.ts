import { NodeBuilder } from './node_builder'
import { BasicExecutionNode, Node, Source, Sink } from './node'
import { level } from './level'
import { Tis100State } from './macros'

export class Tis100 {
  private level: level
  private nodeGrid: BasicExecutionNode[][]
  private sources: Source[]
  private sinks: Sink[]
  private state: Tis100State = Tis100State.IDLE

  constructor(level: level) {
    this.level = level
    let nodeBuilder = new NodeBuilder(
      level.x,
      level.y,
      level.sources,
      level.sinks
    )
    
    Node._id = 0
    Sink._id = 0
    Source._id = 0

    this.nodeGrid = nodeBuilder.getNodeGrid()
    this.sinks = nodeBuilder.getSinks()
    this.sources = nodeBuilder.getSources()
  }

  stop() {
    if (this.state === Tis100State.RUNNING) {
      this.state = Tis100State.IDLE
      this.sources.forEach(source => source.reset())
      this.nodeGrid.forEach(nodeRow => {
        nodeRow.forEach(node => {
          node.reset()
        })
      })
      this.sinks.forEach(sink => sink.reset())
    }
  }

  step() {
    this.sources.forEach(source => {
      source.execute()
    })

    this.sinks.forEach(sink => {
      sink.execute()
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

    if (this.state === Tis100State.IDLE) this.state = Tis100State.RUNNING
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

  getState(): Tis100State {
    return this.state
  }
}
