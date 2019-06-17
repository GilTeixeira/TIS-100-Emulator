import { BasicExecutionNode } from './node'
import { Instructions, Directions } from './macros'
import {
  AbsCommand,
  NopCommand,
  SwpCommand,
  SavCommand,
  NegCommand,
  SubCommand,
  AddCommand,
  MovCommand,
  JmpCommand,
  JezCommand,
  JnzCommand,
  JgzCommand,
  JlzCommand,
  JroCommand
} from './commands'
import { toAst } from './parser/visitor'
import { ArgumentValue, ArgumentACC, ArgumentDir } from './command_args'

export class CommandParser {
  nextInstructionLabels: String[] = []
  constructor(private program: String, readonly node: BasicExecutionNode) {}

  parseProgram(): AbsCommand[] {
    let program: AbsCommand[] = []
    const programLines = toAst(this.program)

    programLines.forEach(line => {
      let instruction = this.parseLine(line)
      if (instruction) program.push(instruction)
    })

    return program
  }

  parseLine(line): AbsCommand {
    let lhs, rhs, labelsCopy

    if (line.label) this.nextInstructionLabels.push(line.label)

    if (!line.instruction.operator) return

    if (line.instruction.lhs) lhs = this.parseArg(line.instruction.lhs)

    if (line.instruction.rhs) rhs = this.parseArg(line.instruction.rhs)

    labelsCopy = [...this.nextInstructionLabels]
    this.nextInstructionLabels = []

    switch (line.instruction.operator) {
      case Instructions.NOP:
        return new NopCommand(this.node, labelsCopy, line.line)
      case Instructions.SWP:
        return new SwpCommand(this.node, labelsCopy, line.line)
      case Instructions.SAV:
        return new SavCommand(this.node, labelsCopy, line.line)
      case Instructions.NEG:
        return new NegCommand(this.node, labelsCopy, line.line)
      case Instructions.SUB:
        return new SubCommand(this.node, labelsCopy, lhs, line.line)
      case Instructions.ADD:
        return new AddCommand(this.node, labelsCopy, lhs, line.line)
      case Instructions.MOV:
        return new MovCommand(this.node, labelsCopy, lhs, rhs, line.line)
      case Instructions.JMP:
        return new JmpCommand(this.node, labelsCopy, lhs, line.line)
      case Instructions.JEZ:
        return new JezCommand(this.node, labelsCopy, lhs, line.line)
      case Instructions.JNZ:
        return new JnzCommand(this.node, labelsCopy, lhs, line.line)
      case Instructions.JGZ:
        return new JgzCommand(this.node, labelsCopy, lhs, line.line)
      case Instructions.JLZ:
        return new JlzCommand(this.node, labelsCopy, lhs, line.line)
      case Instructions.JRO:
        return new JroCommand(this.node, labelsCopy, lhs, line.line)
    }
    return null
  }
  parseArg(arg: any): any {
    switch (arg.type) {
      case 'Port':
        let direction: any = Directions[arg.value]
        return new ArgumentDir(this.node, direction)
      case 'Register':
        return new ArgumentACC(this.node)
      case 'Integer':
        return new ArgumentValue(arg.value)
      default:
        return arg
    }
  }
}
