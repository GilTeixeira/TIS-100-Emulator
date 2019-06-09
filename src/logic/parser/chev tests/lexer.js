"use strict"
// Written Docs for this tutorial step can be found here:
// https://github.com/SAP/chevrotain/blob/master/docs/tutorial/step1_lexing.md

// Tutorial Step 1:
// Implementation of A lexer for a simple SELECT statement grammar
const chevrotain = require("chevrotain")
const Lexer = chevrotain.Lexer
const createToken = chevrotain.createToken

// the vocabulary will be exported and used in the Parser definition.
const tokenVocabulary = {}

// createToken is used to create a TokenType
// The Lexer's output will contain an array of token Objects created by metadata
const Identifier = createToken({
    name: "Identifier",
    pattern: /[a-zA-Z]\w*/
})

const Integer = createToken({
    name: "Integer",
    pattern: /(0|-?([1-9][0-9][0-9]|[1-9][0-9]|[1-9]))/
})

const Acc = createToken({
    name: "Acc",
    pattern: /Acc/i,
    longer_alt: Identifier    
})

const Bak = createToken({
    name: "Bak",
    pattern: /Bak/i,
    longer_alt: Identifier
})

const Nil = createToken({
    name: "Nil",
    pattern: /Nil/i,
    longer_alt: Identifier
})

const Left = createToken({
    name: "Left",
    pattern: /Left/i,
    longer_alt: Identifier
})

const Right = createToken({
    name: "Right",
    pattern: /Right/i,
    longer_alt: Identifier
})

const Up = createToken({
    name: "Up",
    pattern: /Up/i,
    longer_alt: Identifier
})

const Down = createToken({
    name: "Down",
    pattern: /Down/i,
    longer_alt: Identifier
})

const Any = createToken({
    name: "Any",
    pattern: /Any/i,
    longer_alt: Identifier
})

const Last = createToken({
    name: "Last",
    pattern: /Last/i,
    longer_alt: Identifier
})

const Comment = createToken({
    name: "Comment",
    pattern: /#.*/,
    group: Lexer.SKIPPED
})

/*
const Label = createToken({
    name: "Label",
    pattern: /[A-Za-z0-9\-\_]+:/
})*/

const Nop = createToken({
    name: "Nop",
    pattern: /Nop/i,
    longer_alt: Identifier
})

const Mov = createToken({
    name: "Mov",
    pattern: /Mov/i,
    longer_alt: Identifier
})

const Swp = createToken({
    name: "Swp",
    pattern: /Swp/i,
    longer_alt: Identifier
})

const Sav = createToken({
    name: "Sav",
    pattern: /Sav/i,
    longer_alt: Identifier
})

const Add = createToken({
    name: "Add",
    pattern: /Add/i,
    longer_alt: Identifier
})

const Sub = createToken({
    name: "Sub",
    pattern: /Sub/i,
    longer_alt: Identifier
})

const Neg = createToken({
    name: "Neg",
    pattern: /Neg/i,
    longer_alt: Identifier
})

const Jmp = createToken({
    name: "Jmp",
    pattern: /Jmp/i,
    longer_alt: Identifier
})

const Jez = createToken({
    name: "Jez",
    pattern: /Jez/i,
    longer_alt: Identifier
})

const Jnz = createToken({
    name: "Jnz",
    pattern: /Jnz/i,
    longer_alt: Identifier
})

const Jgz = createToken({
    name: "Jgz",
    pattern: /Jgz/i,
    longer_alt: Identifier
})

const Jlz = createToken({
    name: "Jlz",
    pattern: /Jlz/i,
    longer_alt: Identifier
})

const Jro = createToken({
    name: "Jro",
    pattern: /Jro/i,
    longer_alt: Identifier
})

const Comma = createToken({
    name: "Comma",
    pattern: /,/,
    group: Lexer.SKIPPED
})

const Colon = createToken({
    name: "Colon",
    pattern: /:/
    //group: Lexer.SKIPPED
})

const Newline = createToken({
    name: "Newline",
    pattern: /(\r\n|\r|\n)/
})


const WhiteSpace = createToken({
    name: "WhiteSpace",
    pattern: /[ \t]/,
    group: Lexer.SKIPPED
})

// The order of tokens is important
const allTokens = [
    WhiteSpace,
    Acc,
    Bak,
    Nil,
    Left,
    Right,
    Up,
    Down,
    Any,
    Last,
    Nop,
    Mov,
    Swp,
    Sav,
    Add,
    Sub,
    Neg,
    Jmp,
    Jez,
    Jnz,
    Jgz,
    Jlz,
    Jro,
    //Label,
    Comment,
    Comma,
    Newline,
    Colon,
    Integer,
    Identifier //  the Identifier Token must appear after ALL the Keyword Tokens
]

const SelectLexer = new Lexer(allTokens)

allTokens.forEach(tokenType => {
    tokenVocabulary[tokenType.name] = tokenType
})

module.exports = {
    tokenVocabulary: tokenVocabulary,

    lex: function (inputText) {
        const lexingResult = SelectLexer.tokenize(inputText)

        if (lexingResult.errors.length > 0) {
            console.log(inputText)
            console.log(lexingResult.errors)
            throw Error("Sad Sad Panda, lexing errors detected")
        }

        return lexingResult
    }
}