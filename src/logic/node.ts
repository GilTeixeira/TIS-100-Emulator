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
  private commands: Command[];  
  private index: number = 0;
  public state: Status = Status.IDLE;

  constructor(instructions: string) {
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
    this.parseInstructions(instructions);
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

  getID(): number {
    return this.id;
  }

  incIndex() {
    this.index++;
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

  pushNumber(direction: Directions, n: number): void {
    this.dstPorts[direction].setValue(n);
  }

  readNumber(direction: Directions): number {
    return this.srcPorts[direction].popValue();
  }

  hasValue(direction: Directions): boolean {
    return this.srcPorts[direction].hasValue();
  }

  executeRead() {
    this.commands[this.index].executeRead();
  }

  executeWrite() {
    this.commands[this.index].executeWrite();
  }

  parseInstructions(instructions: string): void {
    this.commands = new CommandParser(instructions, this).parseProgram()
  }
}
