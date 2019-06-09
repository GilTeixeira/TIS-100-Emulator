
// Written Docs for this tutorial step can be found here:
// https://github.com/SAP/chevrotain/blob/master/docs/tutorial/step2_parsing.md

// Tutorial Step 2:

// Adding a Parser (grammar only, only reads the input without any actions).
// Using the Token Vocabulary defined in the previous step.

import { CstParser } from "chevrotain";
import { lex, tokenVocabulary } from "./lexer";

//const selectLexer = require("./lexer")
//const CstParser = require("chevrotain").CstParser
//const tokenVocabulary = selectLexer.tokenVocabulary

// individual imports, prefer ES6 imports if supported in your runtime/transpiler...
//const WhiteSpace = tokenVocabulary.WhiteSpace
//const Comma = tokenVocabulary.Comma
//const Comment = tokenVocabulary.Comment


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

const Colon = tokenVocabulary.Colon
const Newline = tokenVocabulary.Newline
const Integer = tokenVocabulary.Integer
const Identifier = tokenVocabulary.Identifier
const WhiteSpace = tokenVocabulary.WhiteSpace





// ----------------- parser -----------------
class Parser extends CstParser {

    constructor(tokenVocabulary, config?) {
        super(tokenVocabulary, config)
        this.performSelfAnalysis()
    }

    public program = this.RULE("program", () => {
        this.AT_LEAST_ONE_SEP({
            SEP: Newline,
            DEF: () => {
                /*
                this.OPTION(function () {
                    this.SUBRULE(this.label)
                })

                this.OPTION2(function () {
                    this.SUBRULE(this.instruction)
                })

                this.OPTION3(function () {
                    this.SUBRULE2(this.label)
                    this.SUBRULE2(this.instruction)
                })
                    */
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
// We only ever need one as the parser internal state is reset for each new input.

/*
const parser = new SelectParser([])
const parserInstance = new SelectParser([])

function parseInput(text) {
    const lexingResult = selectLexer.lex(text)
    // "input" is a setter which will reset the parser's state.
    parser.input = lexingResult.tokens
    parser.program()

    if (parser.errors.length > 0) {
        console.log(text)
        console.log(parser.errors)
        throw new Error("sad sad panda, Parsing errors detected")
    }
}

const inputText = "nop \n nop \n label: nop"
parseInput(inputText)


module.exports = {
    parserInstance: parserInstance,

    SelectParser: SelectParser,

    parse: function (inputText) {
        const lexResult = selectLexer.lex(inputText)

        // ".input" is a setter which will reset the parser's internal's state.
        parserInstance.input = lexResult.tokens

        // No semantic actions so this won't return anything yet.
        parserInstance.program()

        if (parserInstance.errors.length > 0) {
            throw Error(
                parserInstance.errors[0].message
            )
        }
    }
}

*/