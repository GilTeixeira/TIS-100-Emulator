"use strict"
const expect = require("chai").expect
const _ = require("lodash")
const parse = require("./parser").parse

describe("Chevrotain Tutorial", () => {
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
})

