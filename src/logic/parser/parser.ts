import { CstParser } from "chevrotain";
import { lex, tokenVocabulary } from "./lexer";

//nullOperators
const Nop = tokenVocabulary.Nop
const Swp = tokenVocabulary.Swp
const Sav = tokenVocabulary.Sav
const Neg = tokenVocabulary.Neg

//unaryOperators
const Sub = tokenVocabulary.Sub
const Add = tokenVocabulary.Add

//binaryOperators
const Mov = tokenVocabulary.Mov

//Jumps
const Jmp = tokenVocabulary.Jmp
const Jez = tokenVocabulary.Jez
const Jnz = tokenVocabulary.Jnz
const Jgz = tokenVocabulary.Jgz
const Jlz = tokenVocabulary.Jlz
const Jro = tokenVocabulary.Jro

//Ports
const Left = tokenVocabulary.Left
const Right = tokenVocabulary.Right
const Up = tokenVocabulary.Up
const Down = tokenVocabulary.Down
const Any = tokenVocabulary.Any
const Last = tokenVocabulary.Last

//Registers
const Nil = tokenVocabulary.Nil
const Acc = tokenVocabulary.Acc
const Bak = tokenVocabulary.Bak

//Values
const Integer = tokenVocabulary.Integer
const Identifier = tokenVocabulary.Identifier

//Separators
const Colon = tokenVocabulary.Colon
const Newline = tokenVocabulary.Newline


class Parser extends CstParser {

    constructor(tokenVocabulary, config?) {
        super(tokenVocabulary, config)
        this.performSelfAnalysis()
    }

    public program = this.RULE("program", () => {
        this.AT_LEAST_ONE_SEP({
            SEP: Newline,
            DEF: () => {
                this.OPTION(function () {
                    this.SUBRULE(this.line)
                })
            }
        })
    })

    private line = this.RULE("line", () => {
        this.OR([
            {
                ALT: () => {
                    this.SUBRULE(this.label)
                    this.SUBRULE(this.instruction)
                }
            },
            { ALT: () => this.SUBRULE2(this.instruction) },
            { ALT: () => this.SUBRULE2(this.label) }

        ])
    })

    private label = this.RULE("label", () => {
        this.CONSUME(Identifier)
        this.CONSUME(Colon)
    })

    private instruction = this.RULE("instruction", () => {
        this.OR([
            { ALT: () => this.SUBRULE(this.nullOp) },
            { ALT: () => this.SUBRULE(this.unaryOp) },
            { ALT: () => this.SUBRULE(this.binaryOp) },
            { ALT: () => this.SUBRULE(this.jumpOp) }
        ])
    })

    private nullOp = this.RULE("nullOp", () => {
        this.OR([
            { ALT: () => this.CONSUME(Nop) },
            { ALT: () => this.CONSUME(Swp) },
            { ALT: () => this.CONSUME(Sav) },
            { ALT: () => this.CONSUME(Neg) }
        ])
    })

    private unaryOp = this.RULE("unaryOp", () => {
        this.OR([
            { ALT: () => this.CONSUME(Sub) },
            { ALT: () => this.CONSUME(Add) }
        ])
        this.SUBRULE(this.operand)
    })

    private binaryOp = this.RULE("binaryOp", () => {
        this.CONSUME(Mov)
        this.SUBRULE(this.operand, { LABEL: "lhs" })
        this.SUBRULE2(this.operand, { LABEL: "rhs" })
    })

    private jumpOp = this.RULE("jumpOp", () => {
        this.SUBRULE(this.jumpOps)
        this.CONSUME(Identifier)
    })

    private jumpOps = this.RULE("jumpOps", () => {
        this.OR([
            { ALT: () => this.CONSUME(Jmp) },
            { ALT: () => this.CONSUME(Jez) },
            { ALT: () => this.CONSUME(Jnz) },
            { ALT: () => this.CONSUME(Jgz) },
            { ALT: () => this.CONSUME(Jlz) },
            { ALT: () => this.CONSUME(Jro) }
        ])
    })

    private operand = this.RULE("operand", () => {
        this.OR([
            { ALT: () => this.SUBRULE(this.port) },
            { ALT: () => this.SUBRULE(this.register) },
            { ALT: () => this.CONSUME(Integer) }
        ])
    })

    private port = this.RULE("port", () => {
        this.OR([
            { ALT: () => this.CONSUME(Left) },
            { ALT: () => this.CONSUME(Right) },
            { ALT: () => this.CONSUME(Up) },
            { ALT: () => this.CONSUME(Down) },
            { ALT: () => this.CONSUME(Any) },
            { ALT: () => this.CONSUME(Last) }
        ])
    })

    private register = this.RULE("register", () => {
        this.OR([
            { ALT: () => this.CONSUME(Nil) },
            { ALT: () => this.CONSUME(Acc) },
            { ALT: () => this.CONSUME(Bak) }
        ])
    })
}

const parser = new Parser(tokenVocabulary, { outputCst: true })

function parse(text) {
    const lexingResult = lex(text)

    // "input" is a setter which will reset the parser's state.
    parser.input = lexingResult.tokens
    parser.program()

    if (parser.errors.length > 0) {
        throw new Error(parser.errors[0].message)
    }
}

export {
    parser, parse
}
