
"use strict"
// Written Docs for this tutorial step can be found here:
// https://github.com/SAP/chevrotain/blob/master/docs/tutorial/step3a_adding_actions_separated.md

// Tutorial Step 3a:

// Adding Actions(semantics) to our grammar using a CST Visitor.

import { lex } from "./lexer";
import { parser } from "./parser";
//const selectLexer = require("./lexer")
// re-using the parser implemented in step two.
//const parser = require("./parser")
//const SelectParser = parser.SelectParser

// A new parser instance with CST output (enabled by default).

// The base visitor class can be accessed via the a parser instance.
const BaseVisitor = parser.getBaseCstVisitorConstructor()

class AstVisitor extends BaseVisitor {
    constructor() {
        super()
        this.validateVisitor()
    }

    program(ctx) {
        // "this.visit" can be used to visit none-terminals and will invoke the correct visit method for the CstNode passed.
        //console.log(ctx.line)

        const lines = ctx.line.map(line => this.visit(line))
        //console.log(lines)

        return lines
        /*
        return {
            type: 'PROGRAM',
            lines: lines

        }*/
    }



    line(ctx) {

        const label = this.visit(ctx.label) || {}

        // "whereClause" is optional, "this.visit" will ignore empty arrays (optional)
        let instruction = this.visit(ctx.instruction) || {}
        const line = (label.line || instruction.line) - 1
        delete instruction.line;

        return {
            type: "LINE",
            label: label.name,
            instruction: instruction,
            line: line
        }

    }

    label(ctx) {

        return {
            name: ctx.Identifier[0].image,
            line: ctx.Identifier[0].startLine
        }

    }

    instruction(ctx) {

        if (ctx.nullOp)
            return this.visit(ctx.nullOp)
        else if (ctx.unaryOp)
            return this.visit(ctx.unaryOp)
        else if (ctx.binaryOp)
            return this.visit(ctx.binaryOp)
        else if (ctx.jumpOp)
            return this.visit(ctx.jumpOp)



    }

    nullOp(ctx) {
        //console.log(ctx)
        const op = ctx.Nop || ctx.Swp || ctx.Sav || ctx.Neg

        return {
            operator: op[0].image,
            line: op[0].startLine
        }

    }

    unaryOp(ctx) {
        const op = ctx.Sub || ctx.Add

        const operand = this.visit(ctx.operand)

        return {
            operator: op[0].image,
            lhs: operand,
            line: op[0].startLine
        }
        /*
        const op = ctx.Nop || ctx.Nop 
        return {
            operator: ctx.Nop[0].image,
            lhs: lhs,
        }*/

    }


    binaryOp(ctx) {
        console.log(ctx)
        const op = ctx.Mov

        const lhs = this.visit(ctx.lhs)
        const rhs = this.visit(ctx.rhs)


        return {
            operator: op[0].image,
            lhs: lhs,
            rhs: rhs,
            line: op[0].startLine
        }

    }


    jumpOp(ctx) {
        //console.log(ctx)

        const operator = this.visit(ctx.jumpOps)

        return {
            operator: operator,
            lhs: ctx.Identifier[0].image,
            line: ctx.Identifier[0].startLine
        }

    }


    operand(ctx) {
        //console.log(ctx)

        if (ctx.Integer)
            return {
                type: "Integer",
                value: ctx.Integer[0].image

            }
        else if (ctx.register)
            return this.visit(ctx.register)
        else if (ctx.port)
            return this.visit(ctx.port)


    }


    port(ctx) {
        //console.log(ctx)
        const port = ctx.Left || ctx.Right || ctx.Up || ctx.Down || ctx.Any || ctx.Last


        return {
            type: "Port",
            value: port[0].image

        }

    }

    register(ctx) {

        //console.log(ctx)
        const reg = ctx.Nil || ctx.Acc || ctx.Bak || ctx.Down || ctx.Any || ctx.Last


        return {
            type: "Register",
            value: reg[0].image

        }

    }

    jumpOps(ctx) {
        //console.log(ctx)

        const jump = ctx.Jmp || ctx.Jez || ctx.Jnz || ctx.Jgz || ctx.Jlz || ctx.Jro
        return jump[0].image

    }


}

// Our visitor has no state, so a single instance is sufficient.
const toAstVisitorInstance = new AstVisitor()

function toAst(inputText) {
    // Lex
    const lexResult = lex(inputText)
    parser.input = lexResult.tokens

    // Automatic CST created when parsing
    const cst = parser.program()
    if (parser.errors.length > 0) {
        throw Error(parser.errors[0].message)
    }

    // Visit
    const ast = toAstVisitorInstance.visit(cst)
    return ast
}


export {
    toAst
}
/*
//
parserInstance = new SelectParser([], { outputCst: true })
// Our visitor has no state, so a single instance is sufficient.
const toAstVisitorInstance = new SQLToAstVisitor()

function toAst(inputText) {
    // Lex
    const lexResult = selectLexer.lex(inputText)
    parserInstance.input = lexResult.tokens

    // Automatic CST created when parsing
    const cst = parserInstance.program()
    if (parserInstance.errors.length > 0) {
        throw Error(
            "Sad sad panda, parsing errors detected!\n" +
            parserInstance.errors[0].message
        )
    }

    // Visit
    const ast = toAstVisitorInstance.visit(cst)
    return ast
}
//console.log("nop \n label: nop \n label2: nop \n \n ")
//console.log()
//console.log('toAst("nop \n label: nop \n \n label2: nop \n \n jmp label"')
const res = toAst("mov 3 left\n label: sub acc \n add left\n label2: nop \n \n jmp label")
console.log(res)
console.log(res[0].instruction.lhs)
console.log(res[0].instruction.rhs)
console.log(res[1].instruction.lhs)
console.log(res[4].instruction.lhs)


//

module.exports = {
    toAst: function (inputText) {
        const lexResult = selectLexer.lex(inputText)

        // ".input" is a setter which will reset the parser's internal's state.
        parserInstance.input = lexResult.tokens

        // Automatic CST created when parsing
        const cst = parserInstance.program()

        if (parserInstance.errors.length > 0) {
            throw Error(
                "Sad sad panda, parsing errors detected!\n" +
                parserInstance.errors[0].message
            )
        }

        const ast = toAstVisitorInstance.visit(cst)

        return ast
    }
}

*/