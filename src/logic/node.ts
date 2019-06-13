import { Port, NullPort } from "./port"
import { Directions, Status } from "./macros"
import Command from "./commands"
import { CommandParser } from "./command_parser"

export abstract class Node {
  protected static _id: number = 0
  protected id: number
  protected totalCycles: number
  protected idleCycles: number
  protected state: Status = Status.IDLE

  constructor() {
    this.id = Node._id++
  }

  setState(newState: Status) {
    this.state = newState
  }

  getState(): Status {
    return this.state
  }

  execute() {}

  getIdleness() {
    return this.idleCycles / this.totalCycles
  }
}

export class BasicExecutionNode extends Node {
  private ACC: number = 0
  private BAK: number = 0
  private dstPorts: Port[]
  private srcPorts: Port[]
  private commands: Command[] = []
  private instructions: string
  private index: number = 0

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
    throw new Error("Label not found.")
  }

  setIndex(i: number) {
    this.index = i
  }

  getIndex(): number {
    return this.index
  }

  getInstructionIndex(): number {
    if (this.commands.length === 0) return null

    return this.commands[this.index].getLine()
  }

  getID(): number {
    return this.id
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
    if (this.commands.length === 0) return

    this.commands[this.index].executeRead()
  }

  executeWrite() {
    if (this.commands.length === 0) return

    this.commands[this.index].executeWrite()
  }

  execute() {
    this.executeRead()
    this.executeWrite()
  }

  parseInstructions(): void {
    this.commands = new CommandParser(this.instructions, this).parseProgram()
  }

  resetNode(): void {
    this.index = 0
    this.state = Status.IDLE
    this.ACC = 0
    this.BAK = 0
    this.dstPorts.forEach(port => port.reset())
  }
}

export class Sink extends Node {
  private srcPort: Port
  private outputs: number[] = []

  getOutputs() {
    return this.outputs
  }

  setSrcPort(srcPort: Port) {
    this.srcPort = srcPort
  }

  execute() {
    this.totalCycles++
    if (this.srcPort.hasValue()) this.outputs.push(this.srcPort.popValue())
    else this.idleCycles++
  }
}

export class Source extends Node {
  private dstPort: Port
  private inputs: number[]

  setDstPort(dstPort: Port) {
    this.dstPort = dstPort
  }

  setInputs(inputs: number[]) {
    this.inputs = inputs
  }

  getInputs(): number[] {
    return this.inputs
  }

  execute() {
    this.totalCycles++

    if (!this.dstPort.hasValue()) this.dstPort.setValue(this.inputs.shift())
    else this.idleCycles++
  }
}
