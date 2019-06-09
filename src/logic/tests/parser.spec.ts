import { expect } from 'chai';
import { tokenMatcher } from "chevrotain";
import { lex, tokenVocabulary } from "../parser/lexer";
import { parse } from "../parser/parser";
import { toAst } from "../parser/visitor";
import 'mocha';


//const toAstVisitor = require("./visitor").toAst



//const _ = require("lodash")


describe("Parser", () => {
    context("Step 1 - Lexing", () => {
        it("Can Lex a simple input", () => {
            let inputText = "MOV LEFT, ACC \n NOP"
            let lexingResult = lex(inputText)

            expect(lexingResult.errors).to.be.empty

            let tokens = lexingResult.tokens
            expect(tokens).to.have.lengthOf(5)
            expect(tokens[0].image).to.equal("MOV")
            expect(tokens[1].image).to.equal("LEFT")
            expect(tokens[2].image).to.equal("ACC")
            expect(tokens[3].image).to.equal("\n")
            expect(tokens[4].image).to.equal("NOP")


            // tokenMatcher acts as an "instanceof" check for Tokens
            expect(tokenMatcher(tokens[0], tokenVocabulary.Mov)).to.be.true
            expect(tokenMatcher(tokens[1], tokenVocabulary.Left)).to.be.true
            expect(tokenMatcher(tokens[2], tokenVocabulary.Acc)).to.be.true
            expect(tokenMatcher(tokens[3], tokenVocabulary.Newline)).to.be.true
            expect(tokenMatcher(tokens[4], tokenVocabulary.Nop)).to.be.true

        })
    })

    context("Step 2 - Parsing", () => {
        it("Can Parse a simple input", () => {
            let inputText = "NOP"
            expect(() => parse(inputText)).to.not.throw()
        })

        it("Will throw an error for an invalid input", () => {
            // missing table name
            let inputText = "JMP"
            expect(() => parse(inputText)).to.throw(
                "Expecting token of type --> Identifier <-- but found --> '' <--"
            )
        })
    })

    context("Step 3a - Actions (semantics) using CST Visitor", () => {
        it("Can convert a simple input to an AST", () => {
            const inputText =
                "mov 3 left\n label: sub acc \n add left\n label2: nop \n \n jmp label"
            const ast = toAst(inputText)
            
            
            expect(ast).to.deep.equal([{
                type: 'LINE',
                label: undefined,
                instruction: { operator: 'mov', lhs: { type: 'Integer', value: "3" }, rhs: { type: 'Port', value: 'left' } },
                line: 0
            },
            {
                type: 'LINE',
                label: 'label',
                instruction: { operator: 'sub', lhs: { type: 'Register', value: 'acc' } },
                line: 1
            },
            {
                type: 'LINE',
                label: undefined,
                instruction: { operator: 'add', lhs: { type: 'Port', value: 'left' } },
                line: 2
            },
            {
                type: 'LINE',
                label: 'label2',
                instruction: { operator: 'nop' },
                line: 3
            },
            {
                type: 'LINE',
                label: undefined,
                instruction: { operator: 'jmp', lhs: 'label' },
                line: 5
            }])
        })
    })
})



