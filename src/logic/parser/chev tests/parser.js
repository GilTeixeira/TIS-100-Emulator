"use strict"
// Written Docs for this tutorial step can be found here:
// https://github.com/SAP/chevrotain/blob/master/docs/tutorial/step2_parsing.md

// Tutorial Step 2:

// Adding a Parser (grammar only, only reads the input without any actions).
// Using the Token Vocabulary defined in the previous step.

const selectLexer = require("./lexer")
const CstParser = require("chevrotain").CstParser
const tokenVocabulary = selectLexer.tokenVocabulary

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
class SelectParser extends CstParser {
    constructor() {
        super(tokenVocabulary)

        // for conciseness
        const $ = this

        $.RULE("program", () => {
            $.AT_LEAST_ONE_SEP({
                SEP: Newline,
                DEF: () => {
                    /*
                    $.OPTION(function () {
                        $.SUBRULE($.label)
                    })

                    $.OPTION2(function () {
                        $.SUBRULE($.instruction)
                    })

                    $.OPTION3(function () {
                        $.SUBRULE2($.label)
                        $.SUBRULE2($.instruction)
                    })
                        */
                    $.OPTION(function () {
                        $.SUBRULE($.line)
                    })

                }

            })
        })

        $.RULE("line", () => {
            $.OR([
                {
                    ALT: () => {
                        $.SUBRULE($.label)
                        $.SUBRULE($.instruction)
                    }
                },
                { ALT: () => $.SUBRULE2($.instruction) },
                { ALT: () => $.SUBRULE2($.label) }




            ])

        })

        $.RULE("label", () => {
            $.CONSUME(Identifier)
            $.CONSUME(Colon)
        })

        $.RULE("instruction", () => {
            $.OR([
                { ALT: () => $.SUBRULE($.nullOp) },
                { ALT: () => $.SUBRULE($.unaryOp) },
                { ALT: () => $.SUBRULE($.binaryOp) },
                { ALT: () => $.SUBRULE($.jumpOp) }
            ])
        })
        $.RULE("nullOp", () => {
            $.OR([
                { ALT: () => $.CONSUME(Nop) },
                { ALT: () => $.CONSUME(Swp) },
                { ALT: () => $.CONSUME(Sav) },
                { ALT: () => $.CONSUME(Neg) }
            ])
        })

        $.RULE("unaryOp", () => {
            $.OR([
                { ALT: () => $.CONSUME(Sub) },
                { ALT: () => $.CONSUME(Add) }
            ])
            $.SUBRULE($.operand)

        })

        $.RULE("binaryOp", () => {
            $.CONSUME(Mov)
            $.SUBRULE($.operand, { LABEL: "lhs" })
            $.SUBRULE2($.operand, { LABEL: "rhs" })

        })

        $.RULE("jumpOp", () => {
            $.SUBRULE($.jumpOps)
            $.CONSUME(Identifier)
        })

        $.RULE("jumpOps", () => {
            $.OR([
                { ALT: () => $.CONSUME(Jmp) },
                { ALT: () => $.CONSUME(Jez) },
                { ALT: () => $.CONSUME(Jnz) },
                { ALT: () => $.CONSUME(Jgz) },
                { ALT: () => $.CONSUME(Jlz) },
                { ALT: () => $.CONSUME(Jro) }
            ])
        })

        $.RULE("operand", () => {
            $.OR([
                { ALT: () => $.SUBRULE($.port) },
                { ALT: () => $.SUBRULE($.register) },
                { ALT: () => $.CONSUME(Integer) }
            ])
        })

        $.RULE("port", () => {
            $.OR([
                { ALT: () => $.CONSUME(Left) },
                { ALT: () => $.CONSUME(Right) },
                { ALT: () => $.CONSUME(Up) },
                { ALT: () => $.CONSUME(Down) },
                { ALT: () => $.CONSUME(Any) },
                { ALT: () => $.CONSUME(Last) }
            ])
        })



        $.RULE("register", () => {
            $.OR([
                { ALT: () => $.CONSUME(Nil) },
                { ALT: () => $.CONSUME(Acc) },
                { ALT: () => $.CONSUME(Bak) }
            ])
        })

        this.performSelfAnalysis()
    }
}

// We only ever need one as the parser internal state is reset for each new input.
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