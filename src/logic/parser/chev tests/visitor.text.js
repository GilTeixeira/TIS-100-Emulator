"use strict"
const expect = require("chai").expect
const _ = require("lodash")
const toAstVisitor = require("./visitor").toAst


describe("Chevrotain Tutorial", () => {
    context("Step 3a - Actions (semantics) using CST Visitor", () => {
        it("Can convert a simple input to an AST", () => {
            const inputText =
                "mov 3 left\n label: sub acc \n add left\n label2: nop \n \n jmp label"
            const ast = toAstVisitor(inputText)
            
            
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
