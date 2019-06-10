

import { BasicExecutionNode } from "./node";
import { Instructions } from "./macros";
import {
    AbsCommand, NopCommand, SwpCommand,
    SavCommand, NegCommand, SubCommand,
    AddCommand, MovCommand, JmpCommand,
    JezCommand, JnzCommand, JgzCommand,
    JlzCommand, JroCommand
} from "./commands";
import { toAst } from "./parser/visitor";
import { ArgumentValue, ArgumentACC, ArgumentDir } from "./command_args";


export class CommandParser {
    constructor(private program: String, readonly node: BasicExecutionNode) { }

    parseProgram(): AbsCommand[] {
        let program: AbsCommand[] = []
        const programLines = toAst(this.program)
        

        let nextInstructionLabels: String[] = []

        programLines.forEach(line => {
            let instruction = this.parseLine(line, nextInstructionLabels)
            if (instruction)
                program.push(instruction)
        });


        return program;
    }

    parseLine(line, nextInstructionLabels): AbsCommand {
        let lhs, rhs
        if (line.label)
            nextInstructionLabels.push(line.label)

        if (!line.instruction)
            return

        if (line.instruction.lhs)
            lhs = this.parseArg(line.instruction.lhs)

        if (line.instruction.rhs)
            rhs = this.parseArg(line.instruction.rhs)

        switch (line.instruction.operator) {
            case Instructions.NOP:
                return new NopCommand(this.node, nextInstructionLabels, line.line)
            case Instructions.SWP:
                return new SwpCommand(this.node, nextInstructionLabels, line.line)
            case Instructions.SAV:
                return new SavCommand(this.node, nextInstructionLabels, line.line)
            case Instructions.NEG:
                return new NegCommand(this.node, nextInstructionLabels, line.line)
            case Instructions.SUB:
                return new SubCommand(this.node, nextInstructionLabels, lhs, line.line)
            case Instructions.ADD:
                return new AddCommand(this.node, nextInstructionLabels, lhs, line.line)
            case Instructions.MOV:
                return new MovCommand(this.node, nextInstructionLabels, lhs, rhs, line.line)
            case Instructions.JMP:
                return new JmpCommand(this.node, nextInstructionLabels, lhs, line.line)
            case Instructions.JEZ:
                return new JezCommand(this.node, nextInstructionLabels, lhs, line.line)
            case Instructions.JNZ:
                return new JnzCommand(this.node, nextInstructionLabels, lhs, line.line)
            case Instructions.JGZ:
                return new JgzCommand(this.node, nextInstructionLabels, lhs, line.line)
            case Instructions.JLZ:
                return new JlzCommand(this.node, nextInstructionLabels, lhs, line.line)
            case Instructions.JRO:
                return new JroCommand(this.node, nextInstructionLabels, lhs, line.line)

        }
        return null;
    }
    parseArg(arg: any): any {
        switch (arg.type) {
            case 'Port':
                return new ArgumentDir(this.node, arg.value)
            case 'Register':                                        // TODO: It can be NIL
                return new ArgumentACC(this.node)
            case 'Integer':
                return new ArgumentValue(arg.value)
            default:
                return arg
        }
    }

}
