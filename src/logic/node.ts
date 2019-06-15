import { Port, NullPort } from './port'
import { Directions, NodeState } from './macros'
import Command from './commands'
import { CommandParser } from './command_parser'

export abstract class Node {
  protected static _id: number = 0
  protected id: number
  protected totalCycles: number = 0
  protected idleCycles: number = 0
  protected state: NodeState = NodeState.IDLE

  constructor() {
    this.id = Node._id++
  }

  setState(newState: NodeState) {
    this.state = newState
  }

  getState(): NodeState {
    return this.state
  }

  getID(): number {
    return this.id
  }

  execute() {}

  getIdleness() {
    if (this.totalCycles === 0) return this.totalCycles
    return this.idleCycles / this.totalCycles
  }

  reset() {
    this.totalCycles = 0
    this.idleCycles = 0
  }
}

export class BasicExecutionNode extends Node {
  private ACC: number = 0
  private BAK: number = 0
  private dstPorts: Port[]
  private srcPorts: Port[]
  private commands: Command[] = []
  private instructions: string
  private index: number = -1

  constructor() {
    super()

    this.dstPorts = [
      new NullPort(),
      new NullPort(),
      new NullPort(),
      new NullPort()
    ]
    this.srcPorts = [
      new NullPort(),
      new NullPort(),
      new NullPort(),
      new NullPort()
    ]
  }

  getNumberLines(): number {
    return this.commands.length
  }

  getACC(): number {
    return this.ACC
  }

  setACC(vl: number): void {
    this.ACC = vl
  }

  getBAK(): number {
    return this.BAK
  }

  setBAK(vl: number) {
    this.BAK = vl
  }

  public getCommands(): Command[] {
    return this.commands
  }

  public getSrcPorts(): Port[] {
    return this.srcPorts
  }

  findIndex(label: string): number {
    for (var i = 0; i < this.commands.length; i++) {
      if (this.commands[i].getLabels().includes(label)) return i
    }
    throw new Error('Label not found.')
  }

  setIndex(i: number) {
    this.index = i
  }

  getIndex(): number {
    return this.index
  }

  getInstructionIndex(): number {
    if (this.commands.length === 0 || this.index === -1) return null

    return this.commands[this.index].getLine()
  }

  incIndex() {
    if (++this.index >= this.commands.length) this.index = 0
  }

  setDstPort(direction: Directions, dstPort: Port) {
    this.dstPorts[direction] = dstPort
  }

  setSrcPort(direction: Directions, srcPort: Port) {
    this.srcPorts[direction] = srcPort
  }

  setInstructions(instructions: string) {
    this.instructions = instructions
    this.parseInstructions()
  }

  getInstructions(): string {
    return this.instructions
  }

  pushNumber(direction: Directions, n: number): void {
    this.dstPorts[direction].setValue(n)
  }

  readNumber(direction: Directions): number {
    return this.srcPorts[direction].popValue()
  }

  hasValue(direction: Directions): boolean {
    return this.dstPorts[direction].hasValue()
  }

  executeRead() {
    if (this.commands.length === 0 || this.index === -1) return

    this.commands[this.index].executeRead()
  }

  executeWrite() {
    if (this.commands.length === 0) return

    if (this.index === -1) this.index++
    else this.commands[this.index].executeWrite()
  }

  execute() {
    this.executeRead()
    this.executeWrite()
  }

  parseInstructions(): void {
    this.commands = new CommandParser(this.instructions, this).parseProgram()
  }

  reset(): void {
    super.reset()
    this.index = -1
    this.state = NodeState.IDLE
    this.ACC = 0
    this.BAK = 0
    this.dstPorts.forEach(port => port.reset())
  }
}

export class Sink extends Node {
  private srcPort: Port
  private outputs: number[] = []
  protected static _id: number = 0

  constructor() {
    super()
    this.id = Sink._id++
  }

  getOutputs() {
    return this.outputs
  }

  setSrcPort(srcPort: Port) {
    this.srcPort = srcPort
  }

  getSrcPort(): Port {
    return this.srcPort
  }

  execute() {
    this.totalCycles++
    if (this.srcPort.hasValue()) this.outputs.push(this.srcPort.popValue())
    else this.idleCycles++
  }

  reset() {
    super.reset()
    this.outputs = []
    if (this.srcPort) this.srcPort.reset()
  }
}

export class NullSink extends Sink {
  constructor() {
    super()
    Sink._id--
    this.id = null
  }

  getOutputs() {
    return null
  }

  execute() {}
}

export class Source extends Node {
  private dstPort: Port
  private inputs: number[] = []
  private originalInputs: number[] = []
  protected static _id: number = 0

  constructor() {
    super()
    this.id = Source._id++
    this.initInputs()
  }

  setDstPort(dstPort: Port) {
    this.dstPort = dstPort
  }

  getDstPort(): Port {
    return this.dstPort
  }

  setInputs(inputs: number[]) {
    this.inputs = inputs
  }

  getInputs(): number[] {
    return this.inputs
  }

  getOriginalInputs(): number[] {
    return this.originalInputs
  }

  execute() {
    this.totalCycles++

    if (!this.dstPort.hasValue()) this.dstPort.setValue(this.inputs.shift())
    else this.idleCycles++
  }

  initInputs() {
    let n: number = 0
    for (let i = 0; i < 100; i++) {
      n = Math.floor(Math.random() * 100)
      this.inputs.push(n)
      this.originalInputs.push(n)
    }
  }

  reset() {
    super.reset()
    this.inputs = [...this.originalInputs]
    if (this.dstPort) this.dstPort.reset()
  }
}

export class NullSource extends Source {
  constructor() {
    super()
    Source._id--
    this.id = null
  }

  getInputs() {
    return null
  }

  execute() {}
}
