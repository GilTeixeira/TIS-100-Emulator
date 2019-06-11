import { Port, NullPort } from "./port";
import { Directions, Status } from "./macros";
import Command from "./commands";
import { CommandParser } from "./command_parser";

export class BasicExecutionNode {
  private static _id: number = 0;
  private id: number;
  private ACC: number = 0;
  private BAK: number = 0;
  private dstPorts: Port[];
  private srcPorts: Port[];
  private commands: Command[] = [];
  private instructions: string;
  private index: number = 0;
  public state: Status = Status.IDLE;

  constructor() {
    this.id = BasicExecutionNode._id++;

    this.dstPorts = [
      new NullPort(),
      new NullPort(),
      new NullPort(),
      new NullPort()
    ];
    this.srcPorts = [
      new NullPort(),
      new NullPort(),
      new NullPort(),
      new NullPort()
    ];
  }

  getNumberLines(): number {
    return this.commands.length;
  }

  getACC(): number {
    return this.ACC;
  }

  setACC(vl: number): void {
    this.ACC = vl;
  }

  getBAK(): number {
    return this.BAK;
  }

  setBAK(vl: number) {
    this.BAK = vl;
  }

  public getCommands(): Command[] {
    return this.commands;
  }

  public getSrcPorts(): Port[] {
    return this.srcPorts;
  }

  findIndex(label: string): number {
    for (var i = 0; i < this.commands.length; i++) {
      if (this.commands[i].getLabels().includes(label)) return i;
    }
    throw new Error("Label not found.");
  }

  setIndex(i: number) {
    this.index = i;
  }

  getIndex(): number {
    return this.index;
  }

  getInstructionIndex(): number {
    if (this.commands.length === 0)
      return null;

    return this.commands[this.index].getLine();
  }

  getID(): number {
    return this.id;
  }

  incIndex() {
    if (++this.index >= this.commands.length) this.index = 0;
  }

  setState(newState: Status) {
    this.state = newState;
  }

  getState(): Status {
    return this.state;
  }

  setDstPort(direction: Directions, dstPort: Port) {
    this.dstPorts[direction] = dstPort;
  }

  setSrcPort(direction: Directions, srcPort: Port) {
    this.srcPorts[direction] = srcPort;
  }

  setInstructions(instructions: string) {
    this.instructions = instructions;
    this.parseInstructions();
  }

  getInstructions(): string {
    return this.instructions;
  }

  pushNumber(direction: Directions, n: number): void {
    this.dstPorts[direction].setValue(n);
  }

  readNumber(direction: Directions): number {
    return this.srcPorts[direction].popValue();
  }

  hasValue(direction: Directions): boolean {
    return this.dstPorts[direction].hasValue();
  }

  executeRead() {
    if (this.commands.length === 0) return;

    this.commands[this.index].executeRead();
  }

  executeWrite() {
    if (this.commands.length === 0) return;

    this.commands[this.index].executeWrite();
  }

  parseInstructions(): void {
    this.commands = new CommandParser(this.instructions, this).parseProgram();
  }

  resetNode(): void {
    this.index = 0;
    this.state = Status.IDLE;
    this.ACC = 0;
    this.BAK = 0;
    this.dstPorts.forEach(port => port.reset());
  }
}
