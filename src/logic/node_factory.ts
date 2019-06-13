import { BasicExecutionNode, Source, Sink } from "./node"
import { Port } from "./port"
import { Directions } from "./macros"

export class NodeFactory {
  private nodeGrid: BasicExecutionNode[][]
  private sources: Source[]
  private sinks: Sink[]

  constructor(
    private sizeX: number,
    private sizeY: number,
    private sourcesPos: number[],
    private sinksPos: number[]
  ) {
    this.buildNodeGrid()
    this.buildSources()
    this.buildSinks()
    this.initPorts()
  }

  private buildNodeGrid(): void {
    this.nodeGrid = []
    for (let i = 0; i < this.sizeY; i++) {
      this.nodeGrid[i] = []
      for (let j = 0; j < this.sizeX; j++) {
        this.nodeGrid[i][j] = new BasicExecutionNode()
      }
    }
  }

  private initPorts(): void {
    for (let i = 0; i < this.sizeY; i++) {
      for (let j = 0; j < this.sizeX; j++) {
        this.initNodePorts(j, i)
      }
    }
  }

  private initNodePorts(posX: number, posY: number) {
    this.initUpNodePorts(posX, posY)
    this.initRightNodePorts(posX, posY)
    this.initDownNodePorts(posX, posY)
    this.initLeftNodePorts(posX, posY)
  }

  private initUpNodePorts(posX: number, posY: number) {
    if (posY - 1 >= 0) {
      let upPort = new Port()
      this.nodeGrid[posY][posX].setDstPort(Directions.UP, upPort)
      this.nodeGrid[posY - 1][posX].setSrcPort(Directions.DOWN, upPort)
    }

    if (posY === 0 && this.sourcesPos.includes(posX)) {
      let upPort = new Port()
      this.nodeGrid[posY][posX].setSrcPort(Directions.UP, upPort)
      this.sources[this.sourcesPos.indexOf(posX)].setDstPort(upPort)
    }
  }

  private initDownNodePorts(posX: number, posY: number) {
    let sizeY: number = this.nodeGrid.length

    if (posY + 1 < sizeY) {
      let downPort = new Port()
      this.nodeGrid[posY][posX].setDstPort(Directions.DOWN, downPort)
      this.nodeGrid[posY + 1][posX].setSrcPort(Directions.UP, downPort)
    }

    if (posY + 1 === sizeY && this.sinksPos.includes(posX)) {
      let downPort = new Port()
      this.nodeGrid[posY][posX].setDstPort(Directions.DOWN, downPort)
      this.sinks[this.sinksPos.indexOf(posX)].setSrcPort(downPort)
    }
  }

  private initLeftNodePorts(posX: number, posY: number) {
    if (posX - 1 >= 0) {
      let leftPort = new Port()
      this.nodeGrid[posY][posX].setDstPort(Directions.LEFT, leftPort)
      this.nodeGrid[posY][posX - 1].setSrcPort(Directions.RIGHT, leftPort)
    }
  }

  private initRightNodePorts(posX: number, posY: number) {
    let sizeX: number = this.nodeGrid[0].length

    if (posX + 1 < sizeX) {
      let rightPort = new Port()
      this.nodeGrid[posY][posX].setDstPort(Directions.RIGHT, rightPort)
      this.nodeGrid[posY][posX + 1].setSrcPort(Directions.LEFT, rightPort)
    }
  }

  private buildSources(): void {
    this.sources = []
    for (let i = 0; i < this.sources.length; i++) {
      this.sources.push(new Source())
    }
  }

  private buildSinks(): void {
    this.sinks = []
    for (let i = 0; i < this.sinks.length; i++) {
      this.sinks.push(new Sink())
    }
  }

  public getNodeGrid(): BasicExecutionNode[][] {
    return this.nodeGrid
  }
  public getSources(): Source[] {
    return this.sources
  }

  public getSinks(): Sink[] {
    return this.sinks
  }
}
